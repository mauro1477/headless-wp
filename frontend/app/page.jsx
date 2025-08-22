export const revalidate = 60;

async function gql(body) {
  const r = await fetch('http://localhost:3000/api/graphql', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body), cache: 'no-store'
  });
  return r.json();
}

export default async function Home() {
  const { data } = await gql({
    query: `{
      posts(first:5){ nodes{ slug title status } }
      pages(first:5){ nodes{ uri title } }
    }`
  });

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Headless WP</h1>

      <h2 style={{marginTop:24}}>Latest Posts</h2>
      <ul>
        {(data?.posts?.nodes || []).map(p => (
          <li key={p.slug}><a href={`/post/${p.slug}`}>{p.title}</a></li>
        ))}
      </ul>

      <h2 style={{marginTop:24}}>Pages</h2>
      <ul>
        {(data?.pages?.nodes || []).map(pg => {
          const slug = (pg.uri || '/').replace(/^\/|\/$/g,''); // strip leading/trailing '/'
          return <li key={pg.uri}><a href={`/page/${slug}`}>{pg.title}</a></li>;
        })}
      </ul>
    </main>
  );
}
