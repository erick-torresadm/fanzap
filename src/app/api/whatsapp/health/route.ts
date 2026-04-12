import { NextResponse } from 'next/server';

const LOCAL_SERVER = 'https://post-ellen-pulse-diversity.trycloudflare.com';

export async function GET() {
  try {
    const res = await fetch(`${LOCAL_SERVER}/health`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ 
      status: 'offline', 
      message: 'Execute: node whatsapp-server.js' 
    }, { status: 503 });
  }
}