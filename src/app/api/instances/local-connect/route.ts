import { NextResponse } from 'next/server';

const LOCAL_SERVER = 'https://experiencing-int-approximate-plenty.trycloudflare.com';

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
      error: 'Servidor local offline',
      serverRequired: true 
    }, { status: 503 });
  }
}