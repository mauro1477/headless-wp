import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export default async function WpPage(props) {
  const params = await props.params;
  const segs = Array.isArray(params.slug) ? params.slug : [];    // [] for /page
  const uri = '/' + segs.join('/') + '/';

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

  const QUERY = `query ($uri: ID!) {
    page(id: $uri, idType: URI) { title content uri databaseId }
  }`;

  const r = await fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: cookieHeader },
    body: JSON.stringify({ query: QUERY, variables: { uri } }),
    cache: 'no-store',
  });
  const { data } = await r.json();
  const page = data?.page;
  if (!page) return notFound();

  return (
    <main style={{ padding: 24 }}>
      <h1>{page.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: page.content }} />
    </main>
  );
}
