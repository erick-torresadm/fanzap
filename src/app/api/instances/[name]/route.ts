import { NextResponse } from 'next/server';
import { sql } from '@/lib/database';

const LOCAL_SERVER = 'https://experiencing-int-approximate-plenty.trycloudflare.com';

export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;

  try {
    const res = await fetch(`${LOCAL_SERVER}/status/${name}`);
    const data = await res.json();
    
    return NextResponse.json({ name, status: data.status || 'disconnected' });
  } catch {
    return NextResponse.json({ name, status: 'offline' });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  
  return NextResponse.json({ success: true });
}