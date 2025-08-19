export async function getServerSideProps({ req }) {
  const r = await fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: req.headers.cookie || '' },
    body: JSON.stringify({ query: `query { posts(where:{status:DRAFT}, first:10){ nodes{ databaseId title status } } }` }),
  });
  const { data } = await r.json();
  if (!data?.posts) return { redirect: { destination: '/login?next=/drafts', permanent: false } };
  return { props: { posts: data.posts.nodes } };
}
export default function Drafts({ posts }) {
  return <pre style={{padding:24}}>{JSON.stringify(posts, null, 2)}</pre>;
}
