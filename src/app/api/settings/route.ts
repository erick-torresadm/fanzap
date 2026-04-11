import { NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const { userId, apiUrl, apiKey } = await request.json();

    if (!userId || !apiUrl || !apiKey) {
      return NextResponse.json(
        { error: 'userId, apiUrl e apiKey são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO user_api_settings (user_id, api_url, api_key, created_at, updated_at)
      VALUES (${userId}, ${apiUrl}, ${apiKey}, NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        api_url = ${apiUrl},
        api_key = ${apiKey},
        updated_at = NOW()
      RETURNING id
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Save API settings error:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar configurações' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ apiUrl: '', apiKey: '' });
    }

    const result = await sql`
      SELECT api_url, api_key FROM user_api_settings WHERE user_id = ${userId}
    `;

    if (result.length === 0) {
      return NextResponse.json({ apiUrl: '', apiKey: '' });
    }

    return NextResponse.json({
      apiUrl: result[0].api_url,
      apiKey: result[0].api_key
    });
  } catch (error) {
    console.error('[API] Get API settings error:', error);
    return NextResponse.json({ apiUrl: '', apiKey: '' });
  }
}