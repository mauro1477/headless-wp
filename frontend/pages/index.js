import { gqlFetch } from '../lib/gql';
import AuthBar from '../components/AuthBar';
export async function getServerSideProps() {
  const data = await gqlFetch(`
    query Posts {
      posts(first: 10) {
        nodes {
          id
          title
          slug
          date
        }
      }
      generalSettings { title url }
    }
  `);

  return { props: { posts: data.posts.nodes, gs: data.generalSettings } };
}

export default function Home({ posts, gs }) {
  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <AuthBar />
      <h1>{gs?.title || 'Headless WP Frontend'}</h1>
      <p>WP URL: {gs?.url}</p>
      <h2>Latest Posts</h2>
      <ul>
        {posts.map(p => (
          <li key={p.id}>
            <a href={`/posts/${p.slug}`}>{p.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
