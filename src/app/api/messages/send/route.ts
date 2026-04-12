import { NextResponse } from 'next/server';

const LOCAL_SERVER = process.env.LOCAL_SERVER_URL || 'https://unphotographed-aleena-hurriedly.ngrok-free.dev';

export async function POST(request: Request) {
  const { instanceName, number, text } = await request.json();

  if (!instanceName || !number || !text) {
    return NextResponse.json(
      { error: 'instanceName, number e text são obrigatórios' },
      { status: 400 }
    );
  }

  const cleanNumber = number.replace(/\D/g, '');

  try {
    const res = await fetch(`${LOCAL_SERVER}/send/${instanceName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: cleanNumber, message: text })
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({ success: true, number: cleanNumber });
  } catch (error) {
    return NextResponse.json(
      { error: 'Servidor local offline' },
      { status: 503 }
    );
  }
}