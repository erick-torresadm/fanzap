import { NextResponse } from 'next/server';
import { evolutionApi } from '@/lib/evolution-api';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    
    const qrCode = await evolutionApi.connectInstance(name);
    
    return NextResponse.json({
      qrCode: qrCode.qrcode.base64,
      code: qrCode.qrcode.code,
    });
  } catch (error) {
    console.error('Error getting QR code:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get QR code' },
      { status: 500 }
    );
  }
}