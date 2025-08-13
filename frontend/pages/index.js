export async function getServerSideProps() {
  const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ query: `{ generalSettings { title url } }` })
  });
  const json = await res.json();
  return { props: { gs: json.data?.generalSettings || null } };
}

export default function Home({ gs }) {
  return (
    <main style={{padding:24,fontFamily:'sans-serif'}}>
      <h1>Headless WP Frontend</h1>
      <pre>{JSON.stringify(gs, null, 2)}</pre>
    </main>
  );
}
