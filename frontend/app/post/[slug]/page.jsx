import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { sanitizeWP } from '@/lib/sanitize';

export const revalidate = 60;

export default async function PostPage(props) {
  const { slug } = await props.params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

  const QUERY = `query ($slug: ID!) {
    post(id:$slug, idType:SLUG){ title content }
  }`;
  const r = await fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: cookieHeader },
    body: JSON.stringify({ query: QUERY, variables: { slug } }),
    cache: 'no-store',
  });
  const { data } = await r.json();
  const post = data?.post;
  if (!post) return notFound();

  const safe = sanitizeWP(post.content);
  return (
    <main style={{ padding: 24 }}>
      <h1>{post.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: safe }} />
    </main>
  );
}
