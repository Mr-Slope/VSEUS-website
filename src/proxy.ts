import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth.js v5 session cookie names (http vs https).
const SESSION_COOKIES = ['authjs.session-token', '__Secure-authjs.session-token'];

/**
 * Optimistic auth gate: only checks for the presence of a session cookie, no
 * DB calls (this runs on every prefetch). Authoritative role checks live in the
 * /admin server-component layout. See node_modules/next/.../16-proxy.md.
 */
export function proxy(request: NextRequest) {
  const hasSession = SESSION_COOKIES.some((name) => request.cookies.has(name));
  if (hasSession) return NextResponse.next();

  const loginUrl = new URL('/auth/login', request.url);
  loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/portal/:path*', '/admin/:path*'],
};
