import { NextRequest, NextResponse } from 'next/server';
import { getEvolutionApi } from '@/lib/evolution-api-factory';
import { sql, query } from '@/lib/database';

async function getUserApiSettings(userId: string) {
  const result = await sql`SELECT api_url, api_key FROM user_api_settings WHERE user_id = ${userId}`;
  return result[0] || null;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function executeFlow(flow: any, instanceName: string, from: string, apiUrl: string, apiKey: string) {
  console.log(`[FLOW] Executando fluxo "${flow.name}" para ${from}`);
  
  const evolutionApi = getEvolutionApi(apiUrl, apiKey);
  const nodes = typeof flow.nodes === 'string' ? JSON.parse(flow.nodes) : flow.nodes;
  
  for (const node of nodes) {
    if (node.type === 'message' && node.data?.message) {
      try {
        await evolutionApi.sendMessage(instanceName, from, node.data.message);
        await saveMessage({
          instanceName,
          direction: 'outgoing',
          content: node.data.message,
          toNumber: from
        });
        console.log(`[FLOW] Mensagem enviada: ${node.data.message.substring(0, 50)}...`);
      } catch (e) {
        console.error(`[FLOW] Erro ao enviar mensagem:`, e);
      }
    }
    
    if (node.type === 'wait' && node.data?.waitSeconds) {
      console.log(`[FLOW] Aguardando ${node.data.waitSeconds} segundos...`);
      await sleep(node.data.waitSeconds * 1000);
    }
  }
}

async function executeSequence(sequence: any, instanceName: string, from: string, apiUrl: string, apiKey: string) {
  console.log(`[SEQUENCE] Executando sequência "${sequence.name}" para ${from}`);
  
  const evolutionApi = getEvolutionApi(apiUrl, apiKey);
  const messages = typeof sequence.messages === 'string' ? JSON.parse(sequence.messages) : sequence.messages;
  
  for (const msg of messages) {
    if (msg.content) {
      try {
        await evolutionApi.sendMessage(instanceName, from, msg.content);
        await saveMessage({
          instanceName,
          direction: 'outgoing',
          content: msg.content,
          toNumber: from
        });
        console.log(`[SEQUENCE] Mensagem enviada: ${msg.content.substring(0, 50)}...`);
      } catch (e) {
        console.error(`[SEQUENCE] Erro ao enviar mensagem:`, e);
      }
    }
    
    if (msg.delay > 0) {
      console.log(`[SEQUENCE] Aguardando ${msg.delay} segundos...`);
      await sleep(msg.delay * 1000);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[WEBHOOK] Raw body:', JSON.stringify(body));
    
    const instanceName = body.instance || body.instanceName || body.instanceData?.instanceName || body.instanceData?.name;
    console.log('[WEBHOOK] Instance:', instanceName);
    
    if (body.event === 'instance.instanceUp') {
      console.log('[WEBHOOK] Instance connected:', instanceName);
      return NextResponse.json({ success: true, event: 'instanceUp', instance: instanceName });
    }
    
    if (body.event === 'instance.connectionUpdate') {
      const status = body.data?.status;
      console.log(`[WEBHOOK] Connection update: ${instanceName} -> ${status}`);
      return NextResponse.json({ success: true, event: 'connectionUpdate' });
    }
    
    if (body.event === 'messages.upsert') {
      const messages = body.data?.messages || [];
      
      console.log(`[WEBHOOK] ${messages.length} mensagem(s) recebida(s)`);
      
      const defaultApiUrl = process.env.EVOLUTION_API_URL || 'https://api.membropro.com.br';
      const defaultApiKey = process.env.EVOLUTION_API_KEY || 'd6996979cd25b0ebe76ab2fbe509538e';
      let apiUrl = defaultApiUrl;
      let apiKey = defaultApiKey;
      
      // Buscar config do usuário baseado na instância
      const triggers = await getActiveTriggers();
      const sequences = await getActiveSequences();
      
      for (const msg of messages) {
        const from = msg.key?.remoteJid?.replace('@s.whatsapp.net', '').replace('@g.us', '');
        const messageText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
        
        if (!from) continue;
        
        const isFromMe = msg.key?.fromMe === true;
        
        console.log(`[WEBHOOK] Mensagem de ${from}: "${messageText}" (fromMe: ${isFromMe})`);
        
        if (!isFromMe && messageText) {
          await saveMessage({
            instanceName,
            direction: 'incoming',
            content: messageText,
            fromNumber: from,
            messageId: msg.key?.id
          });
          console.log('[WEBHOOK] Mensagem salva no banco');
        }
        
        if (isFromMe) {
          console.log('[WEBHOOK] Mensagem enviada por nós, ignorando');
          continue;
        }
        
        if (!messageText) {
          console.log('[WEBHOOK] Mensagem vazia, ignorando');
          continue;
        }
        
        let triggered = false;
        
        console.log('[WEBHOOK] Verificando triggers...');
        console.log('[WEBHOOK] Triggers encontrados:', triggers.length);
        
        for (const trigger of triggers) {
          const triggerInstance = trigger.instance_name;
          if (triggerInstance && triggerInstance !== instanceName) continue;
          
          const keyword = (trigger.keyword || '').toLowerCase().trim();
          const messageLower = messageText.toLowerCase().trim();
          
          let shouldTrigger = false;
          if (keyword && messageLower.includes(keyword)) {
            shouldTrigger = true;
            console.log(`[WEBHOOK] Trigger ativado! Keyword: "${keyword}" para "${messageLower}"`);
          } else if (!keyword) {
            shouldTrigger = true;
          }
          
          if (shouldTrigger) {
            triggered = true;
            if (trigger.target_type === 'flow' && trigger.target_id) {
              const flows = await getActiveFlows();
              const flow = flows.find((f: any) => f.id === trigger.target_id);
              if (flow) {
                console.log(`[WEBHOOK] Executando fluxo via trigger: ${flow.name}`);
                await executeFlow(flow, instanceName, from, apiUrl, apiKey);
              }
            } else if (trigger.target_type === 'sequence' && trigger.target_id) {
              const sequence = sequences.find((s: any) => s.id === trigger.target_id);
              if (sequence) {
                console.log(`[WEBHOOK] Executando sequência via trigger: ${sequence.name}`);
                await executeSequence(sequence, instanceName, from, apiUrl, apiKey);
              }
            }
          }
        }
        
        if (triggered) {
          console.log('[WEBHOOK] Trigger executado');
          return NextResponse.json({ success: true, triggered: true });
        }
        
        const flows = await getActiveFlows();
        for (const flow of flows) {
          const flowInstance = flow.instance_name;
          if (flowInstance && flowInstance !== instanceName) continue;
          
          const nodes = typeof flow.nodes === 'string' ? JSON.parse(flow.nodes) : flow.nodes;
          const triggerNode = nodes?.find((n: any) => n.type === 'trigger');
          
          if (!triggerNode) {
            console.log(`[WEBHOOK] Executando fluxo "${flow.name}" (sem trigger)`);
            await executeFlow(flow, instanceName, from, apiUrl, apiKey);
            continue;
          }
          
          const nodeData = triggerNode.data as any;
          const condition = nodeData?.condition || 'any';
          let shouldExecute = false;
          
          if (!condition || condition === 'any') {
            shouldExecute = true;
          } else if (condition.startsWith('contains:')) {
            const matchText = condition.replace('contains:', '');
            shouldExecute = messageText.toLowerCase().includes(matchText.toLowerCase());
          } else if (condition.startsWith('equals:')) {
            const matchText = condition.replace('equals:', '');
            shouldExecute = messageText.toLowerCase() === matchText.toLowerCase();
          }
          
          if (shouldExecute) {
            console.log(`[WEBHOOK] Condição aceita, executando fluxo "${flow.name}"`);
            await executeFlow(flow, instanceName, from, apiUrl, apiKey);
          }
        }
        
        for (const sequence of sequences) {
          const seqInstance = sequence.instance_name;
          if (seqInstance && seqInstance !== instanceName) continue;
          
          console.log(`[WEBHOOK] Executando sequência "${sequence.name}"`);
          await executeSequence(sequence, instanceName, from, apiUrl, apiKey);
        }
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[WEBHOOK] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  let flowsCount = 0;
  let sequencesCount = 0;
  let triggersCount = 0;
  
  try {
    const flows = await getActiveFlows();
    const sequences = await getActiveSequences();
    const triggers = await getActiveTriggers();
    flowsCount = flows.length;
    sequencesCount = sequences.length;
    triggersCount = triggers.length;
  } catch (e) {
    console.error('[WEBHOOK] DB error:', e);
  }
  
  return NextResponse.json({ 
    message: 'Webhook endpoint for Evolution API',
    flowsCount,
    sequencesCount,
    triggersCount
  });
}