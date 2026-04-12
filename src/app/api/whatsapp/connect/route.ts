import { NextResponse } from 'next/server';

const LOCAL_SERVER = 'https://separation-pit-stolen-libs.trycloudflare.com';

export async function POST(request: Request) {
  const { instanceId } = await request.json();
  
  if (!instanceId) {
    return NextResponse.json({ error: 'instanceId obrigatório' }, { status: 400 });
  }

  try {
    const res = await fetch(`${LOCAL_SERVER}/connect/${instanceId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ 
      error: 'Servidor local offline. Execute: node whatsapp-server.js',
      serverRequired: true 
    }, { status: 503 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const instanceId = searchParams.get('instanceId');

  if (!instanceId) {
    return NextResponse.json({ error: 'instanceId obrigatório' }, { status: 400 });
  }

  try {
    const res = await fetch(`${LOCAL_SERVER}/status/${instanceId}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ status: 'offline' });
  }
}