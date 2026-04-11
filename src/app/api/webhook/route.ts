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
        await saveMessage({ instanceName, direction: 'outgoing', content: node.data.message, toNumber: from });
      } catch (e) { console.error(`[FLOW] Erro:`, e); }
    }
    if (node.type === 'wait' && node.data?.waitSeconds) await sleep(node.data.waitSeconds * 1000);
  }
}

async function executeSequence(sequence: any, instanceName: string, from: string, apiUrl: string, apiKey: string) {
  console.log(`[SEQUENCE] Executando: "${sequence.name}" para ${from}`);
  const evolutionApi = getEvolutionApi(apiUrl, apiKey);
  const messages = typeof sequence.messages === 'string' ? JSON.parse(sequence.messages) : sequence.messages;
  
  if (!Array.isArray(messages) || messages.length === 0) {
    console.log('[SEQUENCE] Sem mensagens!');
    return;
  }
  
  for (const msg of messages) {
    if (msg.content) {
      try {
        console.log(`[SEQUENCE] Enviando: "${msg.content}"`);
        await evolutionApi.sendMessage(instanceName, from, msg.content);
        await saveMessage({ instanceName, direction: 'outgoing', content: msg.content, toNumber: from });
        console.log('[SEQUENCE] ✅ Enviada!');
      } catch (e) { console.error('[SEQUENCE] Erro:', e); }
    }
    if (msg.delay > 0) await sleep(msg.delay * 1000);
  }
}

function extractMessageText(msg: any): string {
  if (!msg.message) return '';
  
  const types = ['conversation', 'extendedTextMessage', 'imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage'];
  
  for (const type of types) {
    if (msg.message[type]?.text) return msg.message[type].text;
    if (msg.message[type]?.caption) return msg.message[type].caption;
  }
  
  return '';
}

function extractFromNumber(msg: any): string {
  const jid = msg.key?.remoteJid || '';
  return jid.replace('@s.whatsapp.net', '').replace('@g.us', '');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('========== WEBHOOK RECEIDO ==========');
    console.log('Keys do payload:', Object.keys(body));
    console.log('Evento:', body.event);
    console.log('Instance:', body.instance);
    
    // Extrair instanceName de várias formas possíveis
    const instanceName = body.instance || body.instanceName || body.instanceData?.instanceName || body.instanceData?.name || 'rickteste';
    console.log('Instance extraído:', instanceName);
    
    const event = body.event || '';
    console.log('Tipo do evento:', event);
    
    // Se não for evento de mensagem, responder OK
    if (!event.includes('messages') && event !== 'MESSAGES_UPSERT') {
      console.log('[WEBHOOK] Evento ignorado:', event);
      return NextResponse.json({ success: true, event: event });
    }
    
    // Processar mensagens
    const messages = body.data?.messages || [];
    console.log('Mensagens recebidas:', messages.length);
    
    if (messages.length === 0) {
      console.log('[WEBHOOK] Sem mensagens no data.messages');
      // Tentar alternativas
      if (body.data?.key && body.data?.message) {
        console.log('[WEBHOOK] Tentando mensagem única no data');
        messages.push(body.data);
      }
    }
    
    const apiUrl = DEFAULT_API_URL;
    const apiKey = DEFAULT_API_KEY;
    
    const triggers = await getActiveTriggers();
    const sequences = await getActiveSequences();
    
    console.log('Gatilhos carregados:', triggers.length);
    console.log('Sequências carregadas:', sequences.length);
    
    for (const msg of messages) {
      const from = extractFromNumber(msg);
      const messageText = extractMessageText(msg);
      const isFromMe = msg.key?.fromMe === true;
      
      console.log(`\n--- Mensagem ---`);
      console.log(`De: ${from}`);
      console.log(`Texto: "${messageText}"`);
      console.log(`FromMe: ${isFromMe}`);
      
      if (!from) continue;
      
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
          console.log('💾 Mensagem salva no banco');
        } catch (e) { console.error('Erro ao salvar:', e); }
      }
      
      if (isFromMe || !messageText) {
        console.log('⏭️ Pulando (enviada por nós ou vazia)');
        continue;
      }
      
      // Verificar gatilhos
      console.log('\n🔍 Verificando gatilhos...');
      
      for (const trigger of triggers) {
        const triggerInstance = trigger.instance_name || '';
        
        // Ignorar se instância não corresponde
        if (triggerInstance && triggerInstance !== instanceName && triggerInstance !== 'rickteste') {
          console.log(`⏭️ Gatilho pulado (instância ${triggerInstance} != ${instanceName})`);
          continue;
        }
        
        const keyword = (trigger.keyword || '').toLowerCase().trim();
        const messageLower = messageText.toLowerCase().trim();
        
        console.log(`   Gatilho: "${keyword}" vs mensagem: "${messageLower}"`);
        
        if (keyword && messageLower.includes(keyword)) {
          console.log('✅ GATILHO ATIVADO!');
          
          if (trigger.target_type === 'sequence' && trigger.target_id) {
            const sequence = sequences.find((s: any) => s.id === trigger.target_id);
            if (sequence) {
              console.log(`🚀 Executando sequência: ${sequence.name}`);
              await executeSequence(sequence, instanceName, from, apiUrl, apiKey);
              return NextResponse.json({ success: true, triggered: true, sequence: sequence.name });
            }
          } else if (trigger.target_type === 'flow' && trigger.target_id) {
            const flows = await getActiveFlows();
            const flow = flows.find((f: any) => f.id === trigger.target_id);
            if (flow) {
              console.log(`🚀 Executando fluxo: ${flow.name}`);
              await executeFlow(flow, instanceName, from, apiUrl, apiKey);
              return NextResponse.json({ success: true, triggered: true, flow: flow.name });
            }
          }
        }
      }
    }
    
    return NextResponse.json({ success: true, processed: messages.length });
  } catch (error) {
    console.error('[WEBHOOK] ERRO:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const flows = await getActiveFlows();
    const sequences = await getActiveSequences();
    const triggers = await getActiveTriggers();
    
    return NextResponse.json({ 
      status: 'ok',
      flows: flows.length,
      sequences: sequences.length,
      triggers: triggers.length
    });
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}