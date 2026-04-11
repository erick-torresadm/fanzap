import { NextResponse } from 'next/server';
import { evolutionApi } from '@/lib/evolution-api';

export async function GET() {
  try {
    const response = await evolutionApi.getInstances();
    
    const instances = await Promise.all(
      response.map(async (item) => {
        try {
          const info = await evolutionApi.getInstanceInfo(item.instance.instanceName);
          return {
            id: item.instance.instanceName,
            name: item.instance.instanceName,
            status: evolutionApi.mapStatus(info.instance.state),
            phoneNumber: item.instance.owner?.replace('@s.whatsapp.net', '') || '',
          };
        } catch {
          return {
            id: item.instance.instanceName,
            name: item.instance.instanceName,
            status: 'disconnected' as const,
            phoneNumber: '',
          };
        }
      })
    );

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