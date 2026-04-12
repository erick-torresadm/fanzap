import { NextResponse } from 'next/server';
import { sequencesStore } from '@/lib/sequences-store';

const LOCAL_SERVER = 'http://localhost:3001';

export async function POST(request: Request) {
  const { sequenceId, phoneNumber } = await request.json();
  
  if (!sequenceId || !phoneNumber) {
    return NextResponse.json({ error: 'sequenceId e phoneNumber são obrigatórios' }, { status: 400 });
  }
  
  const sequence = sequencesStore.get(sequenceId);
  if (!sequence) {
    return NextResponse.json({ error: 'Sequência não encontrada' }, { status: 404 });
  }

  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const instanceName = sequence.instanceId;
  
  const results = [];
  
  for (const msg of sequence.messages) {
    try {
      await fetch(`${LOCAL_SERVER}/send/${instanceName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: cleanPhone, message: msg.content })
      });
      
      results.push({ messageId: msg.id, success: true });
      
      if (msg.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, msg.delay));
      }
    } catch {
      results.push({ messageId: msg.id, success: false });
    }
  }

  return NextResponse.json({ success: true, results });
}