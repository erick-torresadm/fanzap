import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const userCookie = request.cookies.get('fanzap_user');
  
  if (!userCookie) {
    return NextResponse.json({ user: null });
  }
  
  try {
    const user = JSON.parse(decodeURIComponent(userCookie.value));
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}