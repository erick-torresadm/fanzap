import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { instanceId, lastMessageId } = await request.json();
    return NextResponse.json({ messages: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Erro' }, { status: 500 });
  }
}