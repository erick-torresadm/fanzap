import { NextResponse } from 'next/server';
import { evolutionApi } from '@/lib/evolution-api';

export async function POST(request: Request) {
  try {
    const { instanceName, phone, message } = await request.json();

    if (!instanceName || !phone || !message) {
      return NextResponse.json(
        { error: 'instanceName, phone e message sono obrigatori' },
        { status: 400 }
      );
    }

    console.log(`[TEST] Sending to ${phone} via ${instanceName}: ${message}`);

    await evolutionApi.sendMessage(instanceName, phone, message);

    return NextResponse.json({ success: true, sent: true });
  } catch (error) {
    console.error('[TEST] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao enviar' },
      { status: 500 }
    );
  }
}