import { NextResponse } from 'next/server';
import { evolutionApi } from '@/lib/evolution-api';

export async function POST(request: Request) {
  try {
    const { instanceName, number, text } = await request.json();

    if (!instanceName || !number || !text) {
      return NextResponse.json(
        { error: 'instanceName, number e text são obrigatórios' },
        { status: 400 }
      );
    }

    const cleanNumber = number.replace(/\D/g, '');
    
    await evolutionApi.sendMessage(instanceName, cleanNumber, text);

    return NextResponse.json({ success: true, number: cleanNumber });
  } catch (error) {
    console.error('[API] Error sending message:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Falha ao enviar mensagem' },
      { status: 500 }
    );
  }
}