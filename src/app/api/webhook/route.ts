import { NextResponse } from 'next/server';
import { sql, getActiveTriggers, getActiveSequences } from '@/lib/database';

const LOCAL_SERVER = process.env.LOCAL_SERVER_URL || 'https://unphotographed-aleena-hurriedly.ngrok-free.dev';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendMessage(instanceName: string, to: string, content: string, type: string = 'text', mediaUrl?: string) {
  const phoneNumber = to.replace(/\D/g, '');

  // Formato para o servidor local wwebjs: { to, message }
  const payload: any = { to: phoneNumber, message: content };

  // Se for mídia, adicionar URL
  if (type !== 'text' && mediaUrl) {
    payload.mediaUrl = mediaUrl;
    payload.type = type;
  }

  console.log(`[SEND] ${instanceName} -> ${phoneNumber}: ${content.substring(0, 50)}...`);

  const res = await fetch(`${LOCAL_SERVER}/send/${instanceName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errData = await res.text();
    throw new Error(`Falha ao enviar: ${res.status} - ${errData}`);
  }

  return await res.json();
}

async function executeSequence(instanceName: string, to: string, messages: any[]) {
  for (const msg of messages) {
    try {
      const msgContent = msg.content || msg;
      const msgType = msg.type || 'text';
      const msgMediaUrl = msg.mediaUrl || null;

      await sendMessage(instanceName, to, msgContent, msgType, msgMediaUrl);
      console.log(`[SEQUENCE] Enviado com sucesso`);

      // Salvar mensagem enviada no banco
      try {
        await sql`
          INSERT INTO messages (instance_name, direction, to_number, content, created_at)
          VALUES (${instanceName}, 'outgoing', ${to.replace(/\D/g, '')}, ${msgContent}, NOW())
        `;
      } catch {}

    } catch (e: any) {
      console.error('[SEQUENCE] Erro ao enviar:', e.message);
    }

    const delay = msg.delay || 0;
    if (delay > 0) {
      console.log(`[SEQUENCE] Aguardando ${delay}s...`);
      await sleep(delay * 1000);
    }
  }
}

// Normalizar o payload do webhook para um formato padrão
// Aceita: formato customizado, wwebjs events, Evolution API
function normalizeWebhookPayload(body: any): { instance: string; from: string; messageText: string; messageId: string; pushName: string } | null {
  // Formato 1: Nosso formato direto { instance, from, body, messageId, pushName }
  if (body.instance && body.from && body.body) {
    return {
      instance: body.instance,
      from: body.from,
      messageText: body.body,
      messageId: body.messageId || '',
      pushName: body.pushName || ''
    };
  }

  // Formato 2: wwebjs server format { instance, data: { from, body, ... } }
  if (body.instance && body.data?.from && body.data?.body) {
    return {
      instance: body.instance,
      from: body.data.from,
      messageText: body.data.body,
      messageId: body.data.id?._serialized || body.data.id || '',
      pushName: body.data.notifyName || body.data._data?.notifyName || ''
    };
  }

  // Formato 3: wwebjs com message_create event { event: 'message_create', data: { from, body } }
  if (body.event === 'message_create' && body.data?.body) {
    return {
      instance: body.instanceName || body.instance || '',
      from: body.data.from || '',
      messageText: body.data.body,
      messageId: body.data.id?._serialized || '',
      pushName: body.data.notifyName || ''
    };
  }

  // Formato 4: wwebjs { from, body } direto (sem wrapper)
  if (body.from && body.body && !body.instance) {
    // Tentar pegar instância de header ou usar default
    return {
      instance: body.instanceName || 'default',
      from: body.from,
      messageText: body.body,
      messageId: body.id?._serialized || body.messageId || '',
      pushName: body.notifyName || body.pushName || ''
    };
  }

  // Formato 5: Evolution API { data: { key: { remoteJid }, message: { conversation } } }
  if (body.data?.key?.remoteJid && (body.data?.message?.conversation || body.data?.message?.extendedTextMessage?.text)) {
    const remoteJid = body.data.key.remoteJid;
    const phone = remoteJid.replace('@s.whatsapp.net', '').replace('@c.us', '');
    return {
      instance: body.instance || body.data?.instanceName || '',
      from: phone,
      messageText: body.data.message.conversation || body.data.message.extendedTextMessage?.text || '',
      messageId: body.data.key.id || '',
      pushName: body.data.pushName || ''
    };
  }

  return null;
}

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  console.log('[WEBHOOK] Payload recebido:', JSON.stringify(body).substring(0, 500));

  const normalized = normalizeWebhookPayload(body);

  if (!normalized) {
    console.log('[WEBHOOK] Formato não reconhecido:', JSON.stringify(body).substring(0, 200));
    return NextResponse.json({ error: 'Formato de webhook não reconhecido', received: Object.keys(body) }, { status: 400 });
  }

  const { instance, from, messageText, messageId, pushName } = normalized;

  if (!from || !messageText) {
    return NextResponse.json({ error: 'from e body são obrigatórios' }, { status: 400 });
  }

  console.log(`[WEBHOOK] Mensagem de ${from} (${pushName}): "${messageText}" [instância: ${instance}]`);

  // Salvar mensagem no banco
  try {
    await sql`
      INSERT INTO messages (instance_name, direction, from_number, content, message_id, created_at)
      VALUES (${instance}, 'incoming', ${from}, ${messageText}, ${messageId}, NOW())
    `;
  } catch (e: any) {
    console.log('[WEBHOOK] Erro ao salvar mensagem:', e.message);
  }

  // Buscar triggers ativos
  let triggers: any[] = [];
  try {
    triggers = await getActiveTriggers();
  } catch (e: any) {
    console.error('[WEBHOOK] Erro ao buscar triggers:', e.message);
    return NextResponse.json({ success: true, message: 'Mensagem salva, mas erro ao buscar triggers' });
  }

  console.log(`[WEBHOOK] ${triggers.length} triggers ativos encontrados`);

  let triggersMatched = 0;

  for (const trigger of triggers) {
    // Verificar se é para esta instância ou é global
    if (trigger.instance_name && trigger.instance_name !== instance) {
      continue;
    }

    const keyword = (trigger.keyword || '').toLowerCase().trim();
    const msgLower = messageText.toLowerCase().trim();

    if (!keyword) continue;

    // Match: exato ou contém a palavra-chave
    const matched = msgLower === keyword || msgLower.includes(keyword);

    if (matched) {
      triggersMatched++;
      console.log(`[TRIGGER] Palavra-chave "${keyword}" detectada na mensagem "${messageText}"!`);

      if (trigger.target_type === 'sequence' && trigger.target_id) {
        try {
          const sequences = await getActiveSequences();
          const sequence = sequences.find((s: any) => s.id === trigger.target_id);

          if (sequence) {
            console.log(`[TRIGGER] Executando sequência: ${sequence.name} (${sequence.id})`);
            const messages = typeof sequence.messages === 'string'
              ? JSON.parse(sequence.messages)
              : sequence.messages;

            if (!messages || messages.length === 0) {
              console.log(`[TRIGGER] Sequência "${sequence.name}" não tem mensagens`);
              continue;
            }

            console.log(`[TRIGGER] Sequência tem ${messages.length} mensagens`);

            // Executar em background (não bloquear o webhook response)
            executeSequence(instance, from, messages).catch(err => {
              console.error(`[TRIGGER] Erro na execução da sequência: ${err.message}`);
            });
          } else {
            console.log(`[TRIGGER] Sequência ${trigger.target_id} não encontrada ou inativa`);
          }
        } catch (e: any) {
          console.error(`[TRIGGER] Erro ao buscar sequência: ${e.message}`);
        }
      } else if (trigger.target_type === 'flow' && trigger.target_id) {
        console.log(`[TRIGGER] Flow ${trigger.target_id} acionado (não implementado ainda)`);
      }
    }
  }

  console.log(`[WEBHOOK] ${triggersMatched} triggers disparados para "${messageText}"`);

  return NextResponse.json({
    success: true,
    triggersMatched,
    message: `Processado: ${triggersMatched} trigger(s) disparado(s)`
  });
}
