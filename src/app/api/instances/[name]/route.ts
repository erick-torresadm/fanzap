import { NextResponse } from 'next/server';
import { getEvolutionApi } from '@/lib/evolution-api-factory';
import { sql } from '@/lib/database';

async function getUserApiSettings(userId: string) {
  const result = await sql`SELECT api_url, api_key FROM user_api_settings WHERE user_id = ${userId}`;
  return result[0] || null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const { name } = await params;
    
    let apiUrl = process.env.EVOLUTION_API_URL || 'https://api.membropro.com.br';
    let apiKey = process.env.EVOLUTION_API_KEY || 'd6996979cd25b0ebe76ab2fbe509538e';
    
    if (userId) {
      const userSettings = await getUserApiSettings(userId);
      if (userSettings?.api_url) {
        apiUrl = userSettings.api_url;
        apiKey = userSettings.api_key;
      }
    }
    
    const evolutionApi = getEvolutionApi(apiUrl, apiKey);
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
    const userId = request.headers.get('x-user-id');
    const { name } = await params;
    const body = await request.json();
    
    let apiUrl = process.env.EVOLUTION_API_URL || 'https://api.membropro.com.br';
    let apiKey = process.env.EVOLUTION_API_KEY || 'd6996979cd25b0ebe76ab2fbe509538e';
    
    if (userId) {
      const userSettings = await getUserApiSettings(userId);
      if (userSettings?.api_url) {
        apiUrl = userSettings.api_url;
        apiKey = userSettings.api_key;
      }
    }
    
    const evolutionApi = getEvolutionApi(apiUrl, apiKey);
    
    if (body.action === 'setWebhook') {
      const webhookUrl = body.webhookUrl;
      
      if (!webhookUrl) {
        return NextResponse.json(
          { error: 'webhookUrl é obrigatório' },
          { status: 400 }
        );
      }
      
      const instances = await evolutionApi.getInstances();
      const found = instances.find((i: any) => i.name === name || i.id === name);
      
      if (!found) {
        return NextResponse.json(
          { error: `Instância "${name}" não encontrada` },
          { status: 404 }
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
    const userId = request.headers.get('x-user-id');
    const { name } = await params;
    
    let apiUrl = process.env.EVOLUTION_API_URL || 'https://api.membropro.com.br';
    let apiKey = process.env.EVOLUTION_API_KEY || 'd6996979cd25b0ebe76ab2fbe509538e';
    
    if (userId) {
      const userSettings = await getUserApiSettings(userId);
      if (userSettings?.api_url) {
        apiUrl = userSettings.api_url;
        apiKey = userSettings.api_key;
      }
    }
    
    const evolutionApi = getEvolutionApi(apiUrl, apiKey);
    await evolutionApi.deleteInstance(name);
    return NextResponse.json({ success: true });
  } catch (error) {
    try {
      const userId = request.headers.get('x-user-id');
      let apiUrl = process.env.EVOLUTION_API_URL || 'https://api.membropro.com.br';
      let apiKey = process.env.EVOLUTION_API_KEY || 'd6996979cd25b0ebe76ab2fbe509538e';
      
      if (userId) {
        const userSettings = await getUserApiSettings(userId);
        if (userSettings?.api_url) {
          apiUrl = userSettings.api_url;
          apiKey = userSettings.api_key;
        }
      }
      
      const evolutionApi = getEvolutionApi(apiUrl, apiKey);
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