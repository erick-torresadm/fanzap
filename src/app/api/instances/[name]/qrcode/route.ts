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
    
    const text = await response.text();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Evolution API error: ${text}`, code: response.status },
        { status: response.status }
      );
    }
    
    const data = JSON.parse(text);
    
    // Evolution API v2 response format:
    // { pairingCode: "WZYEH1YY", code: "2@y8eK+...", count: 1 }
    // OR for QR code:
    // { qrCode: { code: "...", base64: "data:image/png;base64,..." } }
    
    let qrCode = '';
    let base64 = '';
    let pairingCode = '';
    
    if (data.pairingCode) {
      // Device pairing code mode
      pairingCode = data.pairingCode;
      qrCode = data.code || '';
    } else if (data.qrCode) {
      // QR Code mode
      qrCode = data.qrCode.code || data.qrCode || '';
      base64 = data.qrCode.base64 || data.base64 || '';
    } else if (data.code && data.code.startsWith('2@')) {
      // Legacy format
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