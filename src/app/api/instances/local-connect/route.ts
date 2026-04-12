import { NextResponse } from 'next/server';

const LOCAL_SERVER_URL = 'http://localhost:3001';

export async function POST(request: Request) {
  const { instanceId } = await request.json();
  
  if (!instanceId) {
    return NextResponse.json({ error: 'instanceId obrigatório' }, { status: 400 });
  }

  try {
    const res = await fetch(`${LOCAL_SERVER_URL}/connect/${instanceId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    // Servidor local não está rodando
    return NextResponse.json({ 
      error: 'Servidor local não está rodando. Execute: node whatsapp-server.js',
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
    const res = await fetch(`${LOCAL_SERVER_URL}/status/${instanceId}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ status: 'offline' });
  }
}