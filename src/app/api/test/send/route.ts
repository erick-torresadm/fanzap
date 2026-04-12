import { NextResponse } from 'next/server';

const LOCAL_SERVER = 'https://unphotographed-aleena-hurriedly.ngrok-free.dev';

export async function POST(request: Request) {
  const { instanceName, phone, message } = await request.json();

  if (!instanceName || !phone || !message) {
    return NextResponse.json(
      { error: 'instanceName, phone e message são obrigatórios' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${LOCAL_SERVER}/send/${instanceName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: phone.replace(/\D/g, ''), message })
    });

    const data = await res.json();
    return NextResponse.json({ success: true, ...data });
  } catch {
    return NextResponse.json({ error: 'Servidor local offline' }, { status: 503 });
  }
}