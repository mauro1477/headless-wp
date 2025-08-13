export async function gqlFetch(query, variables = {}, token) {
  const url = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || 'http://localhost:8080/graphql';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) {
    const msg = json.errors.map(e => e.message).join('; ');
    throw new Error(msg);
  }
  return json.data;
}
