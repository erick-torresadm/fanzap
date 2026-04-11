import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  
  const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'https://api.membropro.com.br';
  const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || 'd6996979cd25b0ebe76ab2fbe509538e';
  
  try {
    const response = await fetch(`${EVOLUTION_API_URL}/instance/connect/${name}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_API_KEY,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || `Evolution API error: ${response.status}` },
        { status: response.status }
      );
    }
    
    let qrCode = '';
    let base64 = '';
    let pairingCode = '';
    
    if (data.pairingCode) {
      pairingCode = data.pairingCode;
      qrCode = data.code || '';
    } else if (data.qrCode) {
      qrCode = data.qrCode.code || data.qrCode || '';
      base64 = data.qrCode.base64 || data.base64 || '';
    } else if (data.code && data.code.startsWith('2@')) {
      qrCode = data.code || '';
    }
    
    return NextResponse.json({
      qrCode: base64,
      code: qrCode,
      pairingCode: pairingCode,
    });
  } catch (error) {
    console.error('[QR Code] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get QR code' },
      { status: 500 }
    );
  }
}