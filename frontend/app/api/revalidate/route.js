import { NextResponse } from 'next/server';

export async function POST(req) {
  const { secret, paths = [] } = await req.json().catch(() => ({}));
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { revalidate } = await import('next/cache');
    // Revalidate each path
    for (const p of paths) await revalidate(p);
    return NextResponse.json({ revalidated: paths }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
