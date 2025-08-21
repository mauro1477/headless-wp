import { NextResponse } from 'next/server';
const PROTECTED = ['/account', '/drafts', '/admin'];

export function middleware(req) {
  const url = req.nextUrl.clone();
  if (!PROTECTED.some(p => url.pathname.startsWith(p))) return NextResponse.next();
  const name = process.env.JWT_COOKIE_NAME || 'wpjwt';
  if (!req.cookies.get(name)?.value) {
    url.pathname = '/login'; url.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ['/account/:path*', '/drafts/:path*', '/admin/:path*'] };
