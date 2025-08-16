const DEFAULT_INTERNAL = 'http://nginx/wp-json/simple-jwt-login/v1/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, email, password, login } = req.body || {};
  const id = login || username || email;
  if (!password || !id) return res.status(400).json({ error: 'Missing credentials' });

  const endpoint =
    process.env.WORDPRESS_JWT_ENDPOINT ||
    (process.env.NEXT_PUBLIC_WORDPRESS_URL ? `${process.env.NEXT_PUBLIC_WORDPRESS_URL.replace(/\/$/, '')}/wp-json/simple-jwt-login/v1/auth` : DEFAULT_INTERNAL);

  const body =
    username || email
      ? { ...(email ? { email } : { username }), password }
      : { login: id, password };

  if (process.env.JWT_AUTH_CODE) body.AUTH_CODE = process.env.JWT_AUTH_CODE;

  try {
    const wpRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await wpRes.json().catch(() => ({}));
    const token = data?.jwt || data?.data?.jwt;

    if (!wpRes.ok || !token) {
      return res.status(401).json({ error: data?.message || data?.error || 'Invalid credentials' });
    }

    const name = process.env.JWT_COOKIE_NAME || 'wpjwt';
    const maxAge = 60 * 60;
    res.setHeader('Set-Cookie', `${name}=${encodeURIComponent(token)}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=Lax`);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Upstream error' });
  }
}
