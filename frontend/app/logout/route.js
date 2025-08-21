import { NextResponse } from 'next/server';
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(process.env.JWT_COOKIE_NAME || 'wpjwt', '', { httpOnly: true, maxAge: 0, path: '/', sameSite: 'lax' });
  return res;
}
