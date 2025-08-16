import { gqlFetch } from '../../lib/gql';

export async function getStaticPaths() {
  const data = await gqlFetch(`query { posts(first: 10) { nodes { slug } } }`);
  const paths = data.posts.nodes.map(p => ({ params: { slug: p.slug } }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const QUERY = `
    query PostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        title
        date
        content
        heroBlock {
          heroTitle
          subTitle
        }
      }
    }
  `;
  const data = await gqlFetch(QUERY, { slug: params.slug });
  if (!data?.post) return { notFound: true };
  return { props: { post: data.post }, revalidate: 60 };
}

export default function Post({ post }) {
  const f = post.heroBlock || {};
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <a href="/">← Back</a>
      <h1 style={{ marginTop: 12 }}>{post.title}</h1>
      {/* Text fields */}
      {f.heroTitle && <p style={{ fontSize: 20, marginTop: 8 }}>{f.heroTitle}</p>}
      {f.subTitle && <p style={{ opacity: 0.8 }}>{f.subTitle}</p>}

    </main>
  );
}
