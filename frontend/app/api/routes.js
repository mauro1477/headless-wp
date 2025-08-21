import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { username, email, login, password } = body || {};
  const id = login || username || email;
  if (!id || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });

  const endpoint = process.env.WORDPRESS_JWT_ENDPOINT || 'http://nginx/wp-json/simple-jwt-login/v1/auth';
  const payload = (email ? { email } : (username ? { username } : { login: id }));
  payload.password = password;
  if (process.env.JWT_AUTH_CODE) payload.AUTH_CODE = process.env.JWT_AUTH_CODE;

  const wp = await fetch(endpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  const data = await wp.json().catch(() => ({}));
  const token = data?.jwt || data?.data?.jwt;
  if (!wp.ok || !token) return NextResponse.json({ error: data?.message || 'Invalid credentials' }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  const name = process.env.JWT_COOKIE_NAME || 'wpjwt';
  res.cookies.set(name, token, {
    httpOnly: true, sameSite: 'lax', secure: false, path: '/', maxAge: 60 * 60,
  });
  return res;
}
