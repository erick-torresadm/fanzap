import { NextResponse } from 'next/server';

const LOCAL_SERVER = 'https://post-ellen-pulse-diversity.trycloudflare.com';

export async function POST(request: Request) {
  const { instanceId, to, message } = await request.json();
  
  if (!instanceId || !to || !message) {
    return NextResponse.json({ error: 'instanceId, to e message são obrigatórios' }, { status: 400 });
  }

  try {
    const res = await fetch(`${LOCAL_SERVER}/send/${instanceId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message })
    });
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Servidor local offline' }, { status: 503 });
  }
}