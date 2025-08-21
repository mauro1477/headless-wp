import { cookies } from 'next/headers';

export default async function PostPage({ params: { slug } }) {
  const cookieHeader = cookies().getAll().map(c => `${c.name}=${c.value}`).join('; ');
  const r = await fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: cookieHeader },
    body: JSON.stringify({
      query: `query($slug:ID!){ post(id:$slug, idType:SLUG){ title content } }`,
      variables: { slug },
    }),
    cache: 'no-store',
  });
  const { data } = await r.json();
  if (!data?.post) return <div style={{padding:24}}>Not found</div>;
  return (
    <main style={{padding:24}}>
      <h1>{data.post.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: data.post.content }} />
    </main>
  );
}
