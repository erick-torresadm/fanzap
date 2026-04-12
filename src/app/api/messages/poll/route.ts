import { NextResponse } from 'next/server';

const LOCAL_SERVER = 'https://experiencing-int-approximate-plenty.trycloudflare.com';

export async function POST(request: Request) {
  try {
    const { instanceId, messages, contacts } = await request.json();
    // Por agora, verificar se há novas mensagens via polling
    return NextResponse.json({ messages: [], contacts: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Erro' }, { status: 500 });
  }
}