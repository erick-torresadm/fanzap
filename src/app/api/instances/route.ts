import { NextResponse } from 'next/server';
import { evolutionApi } from '@/lib/evolution-api';

export async function GET() {
  try {
    console.log('[API] Fetching instances...');
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
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Instance name is required' },
        { status: 400 }
      );
    }

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