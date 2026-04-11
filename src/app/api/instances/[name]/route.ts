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
      status: evolutionApi.mapStatus(info.instance.status),
      phoneNumber: info.instance.owner || '',
    });
  } catch (error) {
    console.error('Error getting instance status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get instance status' },
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
    console.error('Error deleting instance:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete instance' },
      { status: 500 }
    );
  }
}