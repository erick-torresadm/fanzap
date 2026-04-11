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
    
    // Log para debug
    console.log(`[QR Code] Instance: ${name}, Status: ${response.status}`);
    console.log(`[QR Code] Response: ${text.substring(0, 500)}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Evolution API error: ${text}`, code: response.status },
        { status: response.status }
      );
    }
    
    const data = JSON.parse(text);
    
    // A Evolution API pode retornar em diferentes formatos
    const qrCode = data.qrCode || data.qrcode?.code || data.code || '';
    const base64 = data.qrcode?.base64 || data.base64 || data.qrCode || '';
    
    return NextResponse.json({
      qrCode: base64,
      code: qrCode,
    });
  } catch (error) {
    console.error('[QR Code] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get QR code' },
      { status: 500 }
    );
  }
}