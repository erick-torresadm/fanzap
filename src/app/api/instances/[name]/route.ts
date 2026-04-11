import { NextResponse } from 'next/server';
import { evolutionApi } from '@/lib/evolution-api';

export const dynamic = 'force-dynamic';

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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const body = await request.json();
    
    if (body.action === 'setWebhook') {
      const webhookUrl = body.webhookUrl;
      
      if (!webhookUrl) {
        return NextResponse.json(
          { error: 'webhookUrl é obrigatório' },
          { status: 400 }
        );
      }
      
      await evolutionApi.setWebhook(name, webhookUrl);
      return NextResponse.json({ success: true, message: 'Webhook configurado com sucesso' });
    }
    
    return NextResponse.json(
      { error: 'Ação desconhecida' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[API] Error updating instance:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao atualizar instância' },
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