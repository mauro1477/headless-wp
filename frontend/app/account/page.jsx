import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic'; // no caching for auth pages

export default async function Account() {
  const cookieHeader = cookies().getAll().map(c => `${c.name}=${c.value}`).join('; ');
  const r = await fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: cookieHeader },
    body: JSON.stringify({ query: '{ viewer { id name username email } }' }),
    cache: 'no-store',
  });
  const { data } = await r.json();
  if (!data?.viewer) return <meta httpEquiv="refresh" content="0; url=/login?next=/account" />;
  return <pre style={{padding:24}}>{JSON.stringify(data.viewer, null, 2)}</pre>;
}
