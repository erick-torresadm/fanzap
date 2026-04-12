import { NextResponse } from 'next/server';
import { sql } from '@/lib/database';

const LOCAL_SERVER = 'https://post-ellen-pulse-diversity.trycloudflare.com';

export async function POST(request: Request) {
  const body = await request.json();
  const userId = body.userId;

  if (!userId) {
    return NextResponse.json({ error: 'userId obrigatório' }, { status: 400 });
  }

  const instanceName = `fanzap_${userId.slice(0, 8)}`;

  try {
    const res = await fetch(`${LOCAL_SERVER}/connect/${instanceName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    await sql`
      INSERT INTO user_instances (user_id, instance_name, created_at)
      VALUES (${userId}, ${instanceName}, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        instance_name = ${instanceName},
        updated_at = NOW()
    `;

    return NextResponse.json({
      qrCode: data.qrCode,
      instanceName: instanceName,
      status: data.status || 'waiting_scan'
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Servidor local offline',
      serverRequired: true
    }, { status: 503 });
  }
}