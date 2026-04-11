import { NextResponse } from 'next/server';
import { sql } from '@/lib/database';

function hashPassword(password: string): string {
  const crypto = require('crypto');
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const existing = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);

    const result = await sql`
      INSERT INTO users (name, email, password, created_at, updated_at)
      VALUES (${name}, ${email}, ${hashedPassword}, NOW(), NOW())
      RETURNING id, email, name
    `;

    const user = result[0];

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

    response.cookies.set('fanzap_user', JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name
    }), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax'
    });

    return response;
  } catch (error) {
    console.error('[API] Register error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar conta' },
      { status: 500 }
    );
  }
}