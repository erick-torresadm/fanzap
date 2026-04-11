import { NextResponse } from 'next/server';
import { evolutionApi } from '@/lib/evolution-api';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const info = await evolutionApi.getInstanceInfo(name);
    
    return NextResponse.json({
      id: name,
      name: name,
      status: evolutionApi.mapStatus(info.instance?.state || 'close'),
    });
  } catch (error) {
    const instances = await evolutionApi.getInstances();
    const found = instances.find((i: any) => i.name === name || i.id === name);
    
    if (found) {
      return NextResponse.json({
        id: (found as any).id || (found as any).name,
        name: (found as any).name || found.id,
        status: evolutionApi.mapStatus(found.connectionStatus || 'disconnected'),
      });
    }
    
    return NextResponse.json(
      { error: 'Instância não encontrada' },
      { status: 404 }
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