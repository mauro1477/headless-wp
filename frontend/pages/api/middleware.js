import { NextResponse } from 'next/server';
const PROTECTED = ['/account', '/drafts', '/admin'];

export function middleware(req) {
  const url = req.nextUrl.clone();
  if (!PROTECTED.some(p => url.pathname.startsWith(p))) return NextResponse.next();

  const cookieName = process.env.JWT_COOKIE_NAME || 'wpjwt';
  const hasToken = req.cookies.get(cookieName)?.value;
  if (!hasToken) {
    url.pathname = '/login';
    url.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/account/:path*', '/drafts/:path*', '/admin/:path*'] };
