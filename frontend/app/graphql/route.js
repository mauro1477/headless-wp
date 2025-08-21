import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  const body = await req.json();
  const token = cookies().get(process.env.JWT_COOKIE_NAME || 'wpjwt')?.value;
  const upstream = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || 'http://nginx/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  return new NextResponse(await upstream.text(), { status: upstream.status });
}
