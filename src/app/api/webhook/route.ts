import { NextResponse } from 'next/server';
import { sql, getActiveTriggers, getActiveSequences } from '@/lib/database';

const LOCAL_SERVER = 'https://unphotographed-aleena-hurriedly.ngrok-free.dev';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function executeSequence(instanceName: string, to: string, messages: any[]) {
  for (const msg of messages) {
    try {
      await fetch(`${LOCAL_SERVER}/send/${instanceName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message: msg.content || msg })
      });
      console.log(`[SEQUENCE] Enviado: ${msg.content || msg}`);
    } catch (e) {
      console.error('[SEQUENCE] Erro:', e.message);
    }
    if (msg.delay > 0) {
      await sleep(msg.delay * 1000);
    }
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { instance, from, body: messageText, messageId, pushName } = body;

  if (!instance || !from || !messageText) {
    return NextResponse.json({ error: 'instance, from e body são obrigatórios' }, { status: 400 });
  }

  console.log(`[WEBHOOK] ${from}: ${messageText} (${instance})`);

  // Salvar mensagem no banco
  try {
    await sql`
      INSERT INTO messages (instance_name, direction, from_number, content, message_id, created_at)
      VALUES (${instance}, 'incoming', ${from}, ${messageText}, ${messageId}, NOW())
    `;
  } catch (e) {
    console.log('[WEBHOOK] Erro ao salvar mensagem:', e.message);
  }

  // Buscar triggers ativos
  const triggers = await getActiveTriggers();
  
  for (const trigger of triggers) {
    // Verificar se é para esta instância ou é global
    if (trigger.instance_name && trigger.instance_name !== instance) continue;
    
    const keyword = (trigger.keyword || '').toLowerCase().trim();
    
    if (keyword && messageText.toLowerCase().includes(keyword)) {
      console.log(`[TRIGGER] Palavra-chave "${keyword}" detectada!`);
      
      if (trigger.target_type === 'sequence' && trigger.target_id) {
        const sequences = await getActiveSequences();
        const sequence = sequences.find((s: any) => s.id === trigger.target_id);
        
        if (sequence) {
          console.log(`[TRIGGER] Executando sequência: ${sequence.name}`);
          const messages = typeof sequence.messages === 'string' 
            ? JSON.parse(sequence.messages) 
            : sequence.messages;
          await executeSequence(instance, from, messages);
        }
      } else if (trigger.target_type === 'flow' && trigger.target_id) {
        console.log(`[TRIGGER] Executando flow ID: ${trigger.target_id}`);
      }
    }
  }

  return NextResponse.json({ success: true });
}