const WP_ORIGIN = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://nginx';
const wp = new URL(WP_ORIGIN);

transformTags: {
  a: (tagName, attribs) => {
    const out = { ...attribs };
    const href = (attribs.href || '').trim();

    // keep existing safety bits…
    if (/^(javascript|data):/i.test(href)) delete out.href;

    // normalize external links
    if (out.target === '_blank') {
      const rel = (out.rel || '').toLowerCase().split(/\s+/);
      if (!rel.includes('noopener')) rel.push('noopener');
      if (!rel.includes('noreferrer')) rel.push('noreferrer');
      out.rel = rel.filter(Boolean).join(' ');
    }

    // rewrite internal WP links to your Next routes
    try {
      const u = new URL(href, WP_ORIGIN);
      const isInternal = u.hostname === wp.hostname;
      if (isInternal) {
        // posts (assuming /<post-slug>/ in WP → /post/<slug> in Next)
        const segs = u.pathname.replace(/^\/|\/$/g,'').split('/');
        if (segs.length === 1 && segs[0]) out.href = `/post/${segs[0]}`;
        // pages (top-level pages → /page/<slug>)
        if (segs.length === 1 && segs[0] && u.pathname.endsWith('/')) out.href = `/page/${segs[0]}`;
      }
    } catch (_) {}

    return { tagName, attribs: out };
  }
}
