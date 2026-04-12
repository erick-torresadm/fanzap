import { NextResponse } from 'next/server';
import { getEvolutionApi } from '@/lib/evolution-api-factory';
import { sql, saveMessage, getActiveTriggers, getActiveSequences, getActiveFlows } from '@/lib/database';

const DEFAULT_API_URL = 'https://api.membropro.com.br';
const DEFAULT_API_KEY = 'd6996979cd25b0ebe76ab2fbe509538e';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function executeFlow(flow: any, instanceName: string, from: string) {
  const evolutionApi = getEvolutionApi(DEFAULT_API_URL, DEFAULT_API_KEY);
  const nodes = typeof flow.nodes === 'string' ? JSON.parse(flow.nodes) : flow.nodes;
  
  for (const node of nodes) {
    if (node.type === 'message' && node.data?.message) {
      try {
        await evolutionApi.sendMessage(instanceName, from, node.data.message);
        await saveMessage({ instanceName, direction: 'outgoing', content: node.data.message, toNumber: from });
      } catch (e) { console.error('[POLL] Erro:', e); }
    }
    if (node.type === 'wait' && node.data?.waitSeconds) await sleep(node.data.waitSeconds * 1000);
  }
}

async function executeSequence(sequence: any, instanceName: string, from: string) {
  const evolutionApi = getEvolutionApi(DEFAULT_API_URL, DEFAULT_API_KEY);
  const messages = typeof sequence.messages === 'string' ? JSON.parse(sequence.messages) : sequence.messages;
  
  if (!Array.isArray(messages) || messages.length === 0) return;
  
  for (const msg of messages) {
    if (msg.content) {
      try {
        await evolutionApi.sendMessage(instanceName, from, msg.content);
        await saveMessage({ instanceName, direction: 'outgoing', content: msg.content, toNumber: from });
      } catch (e) { console.error('[POLL] Erro:', e); }
    }
    if (msg.delay > 0) await sleep(msg.delay * 1000);
  }
}

function extractMessageText(msg: any): string {
  if (!msg.message) return '';
  const types = ['conversation', 'extendedTextMessage'];
  for (const type of types) {
    if (msg.message[type]?.text) return msg.message[type].text;
  }
  return '';
}

function extractFromNumber(msg: any): string {
  const jid = msg.key?.remoteJid || '';
  return jid.replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@lid', '');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { instanceName, lastMessageId } = body;

    if (!instanceName) {
      return NextResponse.json({ error: 'instanceName é obrigatório' }, { status: 400 });
    }

    console.log('[POLL] Verificando mensagens para:', instanceName);

    const evolutionApi = getEvolutionApi(DEFAULT_API_URL, DEFAULT_API_KEY);
    const messages = await evolutionApi.fetchNewMessages(instanceName, lastMessageId);

    console.log('[POLL] Novas mensagens:', messages.length);

    if (messages.length === 0) {
      return NextResponse.json({ messages: [] });
    }

    const triggers = await getActiveTriggers();
    const sequences = await getActiveSequences();

    for (const msg of messages) {
      const from = extractFromNumber(msg);
      const messageText = extractMessageText(msg);
      const isFromMe = msg.key?.fromMe === true;
      
      if (!from || isFromMe || !messageText) continue;

      console.log('[POLL] Mensagem:', from, '->', messageText);

      try {
        await saveMessage({
          instanceName,
          direction: 'incoming',
          content: messageText,
          fromNumber: from,
          messageId: msg.key?.id
        });
      } catch (e) { console.error('[POLL] Save error:', e); }

      for (const trigger of triggers) {
        if (trigger.instance_name && trigger.instance_name !== instanceName) continue;
        
        const keyword = (trigger.keyword || '').toLowerCase().trim();
        
        if (keyword && messageText.toLowerCase().includes(keyword)) {
          console.log('[POLL] Trigger:', keyword);
          
          if (trigger.target_type === 'sequence' && trigger.target_id) {
            const sequence = sequences.find((s: any) => s.id === trigger.target_id);
            if (sequence) {
              console.log('[POLL] Executando:', sequence.name);
              await executeSequence(sequence, instanceName, from);
            }
          } else if (trigger.target_type === 'flow' && trigger.target_id) {
            const flows = await getActiveFlows();
            const flow = flows.find((f: any) => f.id === trigger.target_id);
            if (flow) {
              console.log('[POLL] Executando flow:', flow.name);
              await executeFlow(flow, instanceName, from);
            }
          }
        }
      }
    }

    return NextResponse.json({ messages: messages.slice(0, 5) });
  } catch (error) {
    console.error('[POLL] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}