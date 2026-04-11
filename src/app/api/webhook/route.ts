import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[WEBHOOK] Received:', JSON.stringify(body));
    
    if (body.event === 'messages.upsert') {
      const messages = body.data?.messages || [];
      for (const msg of messages) {
        if (msg.type === 'chat') {
          const from = msg.key?.remoteJid?.replace('@s.whatsapp.net', '');
          const messageText = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
          
          console.log(`[WEBHOOK] Mensagem de ${from}: ${messageText}`);
        }
      }
    }
    
    if (body.event === 'instance.instanceUp') {
      console.log('[WEBHOOK] Instance connected:', body.instance);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[WEBHOOK] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}