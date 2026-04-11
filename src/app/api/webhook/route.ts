import { NextRequest, NextResponse } from 'next/server';
import { getEvolutionApi } from '@/lib/evolution-api-factory';
import { sql, getActiveFlows, getActiveSequences, getActiveTriggers, saveMessage } from '@/lib/database';

const DEFAULT_API_URL = 'https://api.membropro.com.br';
const DEFAULT_API_KEY = 'd6996979cd25b0ebe76ab2fbe509538e';

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
  console.log(`[SEQUENCE] Messages:`, JSON.stringify(sequence.messages));
  
  const evolutionApi = getEvolutionApi(apiUrl, apiKey);
  const messages = typeof sequence.messages === 'string' ? JSON.parse(sequence.messages) : sequence.messages;
  
  if (!Array.isArray(messages) || messages.length === 0) {
    console.log('[SEQUENCE] Nenhuma mensagem na sequência!');
    return;
  }
  
  for (const msg of messages) {
    console.log('[SEQUENCE] Processando mensagem:', msg);
    
    if (msg.content) {
      try {
        console.log(`[SEQUENCE] Enviando para ${from}: ${msg.content}`);
        await evolutionApi.sendMessage(instanceName, from, msg.content);
        await saveMessage({
          instanceName,
          direction: 'outgoing',
          content: msg.content,
          toNumber: from
        });
        console.log(`[SEQUENCE] Mensagem enviada com sucesso`);
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

function extractInstanceName(body: any): string {
  // Tentar várias formas de encontrar o nome da instância
  const possibleKeys = [
    body.instance,
    body.instanceName,
    body.instanceData?.instanceName,
    body.instanceData?.name,
    body.metadata?.instanceName,
    body.instanceData?.instance?.name,
  ];
  
  for (const key of possibleKeys) {
    if (key) return key;
  }
  
  // Se não encontrou, retornar valor padrão
  return 'rickteste';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[WEBHOOK] Full body keys:', Object.keys(body));
    console.log('[WEBHOOK] Body:', JSON.stringify(body).substring(0, 500));
    
    const instanceName = extractInstanceName(body);
    console.log('[WEBHOOK] Instance extraído:', instanceName);
    console.log('[WEBHOOK] Event:', body.event);
    
    // Log de todos os eventos para debug
    console.log('[WEBHOOK] Event type:', body.event);
    console.log('[WEBHOOK] Data keys:', body.data ? Object.keys(body.data) : 'no data');
    
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
      
      const apiUrl = DEFAULT_API_URL;
      const apiKey = DEFAULT_API_KEY;
      
      const triggers = await getActiveTriggers();
      const sequences = await getActiveSequences();
      
      console.log('[WEBHOOK] Triggers carregados:', triggers.length);
      console.log('[WEBHOOK] Sequências carregadas:', sequences.length);
      
      for (const msg of messages) {
        const from = msg.key?.remoteJid?.replace('@s.whatsapp.net', '').replace('@g.us', '');
        const messageText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
        
        if (!from) {
          console.log('[WEBHOOK] Sem from, continuando...');
          continue;
        }
        
        const isFromMe = msg.key?.fromMe === true;
        
        console.log(`[WEBHOOK] Msg: "${messageText}" from: ${from} fromMe: ${isFromMe}`);
        
        // Salvar mensagem recebida
        if (!isFromMe && messageText && instanceName) {
          try {
            await saveMessage({
              instanceName,
              direction: 'incoming',
              content: messageText,
              fromNumber: from,
              messageId: msg.key?.id
            });
            console.log('[WEBHOOK] Mensagem salva no banco');
          } catch (e) {
            console.error('[WEBHOOK] Erro ao salvar mensagem:', e);
          }
        }
        
        if (isFromMe) {
          console.log('[WEBHOOK] Mensagem enviada por nós, ignorando');
          continue;
        }
        
        if (!messageText) {
          console.log('[WEBHOOK] Mensagem vazia, continuando...');
          continue;
        }
        
        // Verificar triggers
        console.log('[WEBHOOK] Verificando triggers para:', messageText);
        
        for (const trigger of triggers) {
          const triggerInstance = trigger.instance_name || '';
          
          // Se trigger tem instância específica, verificar se bate
          if (triggerInstance && triggerInstance !== instanceName) {
            console.log(`[WEBHOOK] Trigger pulado (instância não bate): ${triggerInstance} vs ${instanceName}`);
            continue;
          }
          
          const keyword = (trigger.keyword || '').toLowerCase().trim();
          const messageLower = messageText.toLowerCase().trim();
          
          console.log(`[WEBHOOK] Verificando trigger: keyword="${keyword}" vs msg="${messageLower}"`);
          
          let shouldTrigger = false;
          if (keyword && messageLower.includes(keyword)) {
            shouldTrigger = true;
            console.log(`[WEBHOOK] ✅ Trigger ativado!`);
          }
          
          if (shouldTrigger) {
            console.log(`[WEBHOOK] Executando trigger: ${trigger.name}, target: ${trigger.target_type}`);
            
            if (trigger.target_type === 'sequence' && trigger.target_id) {
              const sequence = sequences.find((s: any) => s.id === trigger.target_id);
              if (sequence) {
                console.log(`[WEBHOOK] Executando sequência: ${sequence.name}`);
                await executeSequence(sequence, instanceName, from, apiUrl, apiKey);
                return NextResponse.json({ success: true, triggered: true });
              } else {
                console.log(`[WEBHOOK] Sequência não encontrada: ${trigger.target_id}`);
              }
            } else if (trigger.target_type === 'flow' && trigger.target_id) {
              const flows = await getActiveFlows();
              const flow = flows.find((f: any) => f.id === trigger.target_id);
              if (flow) {
                console.log(`[WEBHOOK] Executando fluxo: ${flow.name}`);
                await executeFlow(flow, instanceName, from, apiUrl, apiKey);
                return NextResponse.json({ success: true, triggered: true });
              }
            }
          }
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
  try {
    const flows = await getActiveFlows();
    const sequences = await getActiveSequences();
    const triggers = await getActiveTriggers();
    
    return NextResponse.json({ 
      message: 'Webhook endpoint',
      flowsCount: flows.length,
      sequencesCount: sequences.length,
      triggersCount: triggers.length
    });
  } catch (e) {
    console.error('[WEBHOOK] Error:', e);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}