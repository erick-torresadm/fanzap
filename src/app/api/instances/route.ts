import { NextResponse } from 'next/server';
import { sql } from '@/lib/database';

const LOCAL_SERVER = 'https://experiencing-int-approximate-plenty.trycloudflare.com';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: ' userId obrigatório' }, { status: 401 });
    }

    // Buscar instâncias do banco
    const instancesResult = await sql`
      SELECT instance_name FROM user_instances WHERE user_id = ${userId}
    `;

    if (!instancesResult || instancesResult.length === 0) {
      return NextResponse.json([]);
    }

    // Verificar status no servidor local
    const instances = [];
    for (const inst of instancesResult) {
      try {
        const res = await fetch(`${LOCAL_SERVER}/status/${inst.instance_name}`);
        const statusData = await res.json();
        
        instances.push({
          name: inst.instance_name,
          status: statusData.status === 'connected' ? 'connected' : 'disconnected'
        });
      } catch {
        instances.push({
          name: inst.instance_name,
          status: 'offline'
        });
      }
    }

    return NextResponse.json(instances);
  } catch (error) {
    console.error('[Instances] Error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const userId = request.headers.get('x-user-id');
  const { name } = await request.json();

  if (!userId || !name) {
    return NextResponse.json({ error: 'userId e name obrigatórios' }, { status: 400 });
  }

  try {
    // Criar instância no servidor local (vai iniciar o cliente)
    const res = await fetch(`${LOCAL_SERVER}/connect/${name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();

    return NextResponse.json({
      name: name,
      status: data.status || 'connecting'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Servidor offline' }, { status: 503 });
  }
}