import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '../lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Allow access to login page and API auth routes
  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth/login')) {
    return NextResponse.next();
  }

  // Protect all other routes
  if (!token || !verifyToken(token)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/videos/:path*', '/ads/:path*', '/api/videos/:path*', '/api/ads/:path*', '/api/stats'],
};
