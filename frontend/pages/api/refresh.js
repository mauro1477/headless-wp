export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST' });
  const refresh = req.cookies['wprefresh'];
  if (!refresh) return res.status(400).json({ error: 'No refresh token' });

  const endpoint = process.env.WORDPRESS_JWT_REFRESH || 'http://nginx/wp-json/simple-jwt-login/v1/refresh';
  const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh }) });
  const data = await r.json().catch(() => ({}));
  const token = data?.jwt || data?.data?.jwt;
  if (!token) return res.status(401).json({ error: 'Could not refresh' });

  const name = process.env.JWT_COOKIE_NAME || 'wpjwt';
  res.setHeader('Set-Cookie', `${name}=${encodeURIComponent(token)}; Max-Age=3600; Path=/; HttpOnly; SameSite=Lax`);
  res.status(200).json({ ok: true });
}
