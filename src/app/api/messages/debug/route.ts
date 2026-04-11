import { NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET() {
  try {
    const messages = await sql`
      SELECT * FROM messages 
      ORDER BY created_at DESC 
      LIMIT 50
    `;
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('[API] Debug messages error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}