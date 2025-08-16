import { useState } from 'react';

function getCookieFromHeader(cookieHeader, name) {
  if (!cookieHeader) return null;
  const prefix = `${name}=`;
  const parts = cookieHeader.split(/; */);
  for (const p of parts) if (p.startsWith(prefix)) return decodeURIComponent(p.slice(prefix.length));
  return null;
}

export async function getServerSideProps({ req, query }) {
  const cookieName = process.env.JWT_COOKIE_NAME || 'wpjwt';
  const token = getCookieFromHeader(req.headers.cookie || '', cookieName);
  if (token) {
    // already logged in → bounce to next or home
    return { redirect: { destination: query.next || '/', permanent: false } };
  }
  return { props: {} };
}

export default function Login() {
  const [id, setId] = useState('');          // email or username
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const body = id.includes('@')
        ? { email: id, password }
        : { username: id, password };
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Login failed');
      // success
      window.location.href = '/';
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: '12vh auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: 16 }}>Sign in</h1>
      {err && <div style={{ color: 'crimson', marginBottom: 12 }}>{err}</div>}
      <form onSubmit={onSubmit}>
        <label style={{ display: 'block', marginBottom: 10 }}>
          Email or username
          <input
            value={id}
            onChange={e => setId(e.target.value)}
            placeholder="you@example.com or youruser"
            autoComplete="username"
            style={{ display: 'block', width: '100%', padding: 10, marginTop: 6 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 16 }}>
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            style={{ display: 'block', width: '100%', padding: 10, marginTop: 6 }}
          />
        </label>

        <button disabled={loading} type="submit" style={{ padding: '10px 16px' }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
