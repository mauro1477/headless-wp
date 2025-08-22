import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.JWT_COOKIE_NAME || 'wpjwt')?.value;

  const upstream = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || 'http://nginx/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const text = await upstream.text();
  const ct = upstream.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    return NextResponse.json(
      { error: 'Upstream returned non-JSON', status: upstream.status, contentType: ct, bodyPreview: text.slice(0, 300) },
      { status: 502 }
    );
  }
  return new NextResponse(text, { status: upstream.status, headers: { 'content-type': 'application/json' } });
}