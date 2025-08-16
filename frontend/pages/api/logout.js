export default function handler(req, res) {
  const name = process.env.JWT_COOKIE_NAME || 'wpjwt';
  res.setHeader('Set-Cookie', `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
  res.status(200).json({ ok: true });
}
