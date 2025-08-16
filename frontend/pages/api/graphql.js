export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST' });
  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || 'http://nginx/graphql';
  const cookieName = (process.env.JWT_COOKIE_NAME || 'wpjwt') + '=';
  const raw = req.headers.cookie || '';
  const token = raw.split(/; */).find(p => p.startsWith(cookieName))?.slice(cookieName.length);

  const upstream = await fetch(wpUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {}) },
    body: JSON.stringify(req.body),
  });

  const text = await upstream.text();
  res.status(upstream.status).send(text);
}
