import { gqlFetch } from '../../lib/gql';

export async function getStaticPaths() {
  const data = await gqlFetch(`query { posts(first: 10) { nodes { slug } } }`);
  const paths = data.posts.nodes.map(p => ({ params: { slug: p.slug } }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const data = await gqlFetch(`
    query PostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        title
        content
        date
        slug
      }
    }
  `, { slug: params.slug });

  if (!data?.post) return { notFound: true };
  return { props: { post: data.post }, revalidate: 60 };
}

export default function Post({ post }) {
  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <a href="/">← Back</a>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </main>
  );
}
