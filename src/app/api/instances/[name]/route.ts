import { NextResponse } from 'next/server';
import { evolutionApi } from '@/lib/evolution-api';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    
    const instances = await evolutionApi.getInstances();
    const found = instances.find((i: any) => i.name === name || i.id === name);
    
    if (!found) {
      return NextResponse.json(
        { error: 'Instância não encontrada' },
        { status: 404 }
      );
    }
    
    const instanceName = found.name;
    const status = evolutionApi.mapStatus(found.connectionStatus || 'disconnected');
    
    return NextResponse.json({
      id: found.id || found.name,
      name: instanceName,
      status: status,
    });
  } catch (error) {
    console.error('[API] Error getting instance:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao buscar instância' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    await evolutionApi.deleteInstance(name);
    return NextResponse.json({ success: true });
  } catch (error) {
    try {
      const instances = await evolutionApi.getInstances();
      const found = instances.find((i: any) => i.name === name || i.id === name);
      if (found) {
        await evolutionApi.deleteInstance(String(found.name || name));
        return NextResponse.json({ success: true });
      }
    } catch {}
    return NextResponse.json({ success: true });
  }
}