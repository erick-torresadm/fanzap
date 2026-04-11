import { NextResponse } from 'next/server';
import { getEvolutionApi } from '@/lib/evolution-api-factory';
import { sql } from '@/lib/database';

async function getUserApiSettings(userId: string) {
  const result = await sql`SELECT api_url, api_key FROM user_api_settings WHERE user_id = ${userId}`;
  return result[0] || null;
}

export async function GET(request: Request) {
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
    console.log('[API] Fetching instances with API:', apiUrl);
    
    const response = await evolutionApi.getInstances();
    console.log('[API] Raw response:', JSON.stringify(response));
    
    if (!response || response.length === 0) {
      console.log('[API] No instances returned');
      return NextResponse.json([]);
    }
    
    const instances = response.map((item: any) => {
      const name = item.name || item.instanceName;
      const phoneNumber = item.ownerJid?.replace('@s.whatsapp.net', '') || item.owner?.replace('@s.whatsapp.net', '') || '';
      const status = evolutionApi.mapStatus(item.connectionStatus || item.status || 'close');
      
      return {
        id: item.id || name,
        name: name,
        status,
        phoneNumber,
      };
    });

    return NextResponse.json(instances);
  } catch (error) {
    console.error('[API] Error fetching instances:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch instances' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Instance name is required' },
        { status: 400 }
      );
    }

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
    const result = await evolutionApi.createInstance(name);
    
    return NextResponse.json({
      id: result.instance.instanceId,
      name: result.instance.instanceName,
      status: 'connecting',
    });
  } catch (error) {
    console.error('[API] Error creating instance:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create instance' },
      { status: 500 }
    );
  }
}