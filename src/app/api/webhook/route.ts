import { NextResponse } from 'next/server';

const LOCAL_SERVER = process.env.LOCAL_WHATSAPP_URL || 'http://localhost:3001';

export async function POST(request: Request) {
  const body = await request.json();
  const { instance, from, body: messageText, messageId, pushName } = body;

  if (!instance || !from || !messageText) {
    return NextResponse.json({ error: 'instance, from e body são obrigatórios' }, { status: 400 });
  }

  console.log(`[WEBHOOK] ${from}: ${messageText}`);

  // O webhook é chamado pelo servidor local com as mensagens
  // Aqui processamos os triggers e executamos sequências/fluxos
  
  return NextResponse.json({ success: true });
}