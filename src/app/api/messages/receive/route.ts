import { NextResponse } from 'next/server';
import { getEvolutionApi } from '@/lib/evolution-api-factory';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { instanceName, lastMessageId } = body;

    if (!instanceName) {
      return NextResponse.json({ error: 'instanceName é obrigatório' }, { status: 400 });
    }

    const evolutionApi = getEvolutionApi();
    const messages = await evolutionApi.fetchNewMessages(instanceName, lastMessageId);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}