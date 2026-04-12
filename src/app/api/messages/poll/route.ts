import { NextResponse } from 'next/server';

const LOCAL_SERVER = process.env.LOCAL_WHATSAPP_URL || 'http://localhost:3001';

export async function POST(request: Request) {
  try {
    const { instanceId, messages, contacts } = await request.json();
    // Por agora, verificar se há novas mensagens via polling
    return NextResponse.json({ messages: [], contacts: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Erro' }, { status: 500 });
  }
}