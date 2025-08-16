import { useEffect, useState } from 'react';

export default function AuthBar() {
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    (async () => {
      const r = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ viewer { id username } }' }),
      });
      const { data } = await r.json();
      setViewer(data?.viewer || null);
    })();
  }, []);

  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    location.reload();
  }

  return (
    <div style={{padding:8,borderBottom:'1px solid #eee',fontFamily:'system-ui'}}>
      {viewer ? (
        <>
          Signed in as <b>{viewer.username}</b> · <button onClick={logout}>Log out</button>
        </>
      ) : (
        <a href="/login">Sign in</a>
      )}
    </div>
  );
}
