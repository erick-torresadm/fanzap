import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const user = request.cookies.get('fanzap_user');
  
  const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register';
  const isApiAuth = request.nextUrl.pathname.startsWith('/api/auth');
  const isWebhook = request.nextUrl.pathname.startsWith('/api/webhook');
  
  if (isApiAuth || isAuthPage || isWebhook) {
    return NextResponse.next();
  }
  
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/instances/:path*', '/api/flows/:path*', '/api/sequences/:path*', '/api/triggers/:path*', '/api/auth/:path*', '/api/webhook/:path*'],
};