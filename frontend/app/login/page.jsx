'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const next = useSearchParams().get('next') || '/';

  async function onSubmit(e) {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const body = id.includes('@') ? { email: id, password } : { login: id, password };
      const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
      router.push(next);
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  }

  return (
    <main style={{maxWidth:420,margin:'12vh auto',padding:24,fontFamily:'system-ui'}}>
      <h1>Sign in</h1>
      {err && <div style={{color:'crimson',marginBottom:12}}>{err}</div>}
      <form onSubmit={onSubmit}>
        <label style={{display:'block',marginBottom:10}}>
          Email or username
          <input value={id} onChange={e=>setId(e.target.value)} autoComplete="username"
                 style={{display:'block',width:'100%',padding:10,marginTop:6}}/>
        </label>
        <label style={{display:'block',marginBottom:16}}>
          Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
                 autoComplete="current-password"
                 style={{display:'block',width:'100%',padding:10,marginTop:6}}/>
        </label>
        <button disabled={loading} type="submit" style={{padding:'10px 16px'}}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
