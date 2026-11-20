import { NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

// Fast optimistic gate: no session cookie -> send to Sign In (remembering where the user wanted to go).
// The real, authoritative role checks happen in the server layouts and in the Express API.
export function middleware(request) {
  if (!getSessionCookie(request)) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // /menu/:id only (single segment, no file extension) + dashboard + payment pages
  matcher: ['/dashboard/:path*', '/menu/:id([^./]+)', '/payment/:path*'],
};
