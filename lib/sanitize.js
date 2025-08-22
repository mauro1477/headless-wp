import sanitizeHtml from 'sanitize-html';

/**
 * WP-friendly HTML sanitizer.
 * - Allows common content tags (headings, images, tables, embeds)
 * - Blocks inline event handlers, scripts, JS URLs
 * - Tight iframe allowlist (YouTube/Vimeo by default)
 * - Normalizes external links to be noopener/noreferrer
 */
export function sanitizeWP(html) {
  return sanitizeHtml(html || '', {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'figure', 'figcaption', 'video', 'audio', 'source',
      'iframe', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      'code', 'pre', 'hr'
    ]),
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel', 'title'],
      img: ['src', 'srcset', 'sizes', 'alt', 'title', 'width', 'height', 'loading'],
      iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'title'],
      video: ['src', 'controls', 'poster', 'width', 'height', 'loop', 'muted', 'playsinline'],
      audio: ['src', 'controls'],
      source: ['src', 'type', 'srcset', 'sizes'],
      table: ['role'], th: ['scope'],
      // allow class/data-* so WP/Gutenberg styling still works
      '*': ['class', 'data-*', 'aria-*']
    },
    // Only allow safe URI schemes
    allowedSchemes: ['http', 'https', 'mailto', 'tel', 'data'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data'],
      source: ['http', 'https', 'data']
    },
    // Restrict iframes to known hosts (expand if you embed others)
    allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'player.vimeo.com'],

    // Make external links safe and block weird hrefs
    transformTags: {
      a: (tagName, attribs) => {
        const out = { ...attribs };
        const href = (attribs.href || '').trim();

        // Disallow javascript: and data: on anchors
        const unsafe = /^(javascript|data):/i.test(href);
        if (unsafe) delete out.href;

        // Normalize target/rel when opening new tabs
        if (out.target === '_blank') {
          const rel = (out.rel || '').toLowerCase().split(/\s+/);
          if (!rel.includes('noopener')) rel.push('noopener');
          if (!rel.includes('noreferrer')) rel.push('noreferrer');
          out.rel = rel.filter(Boolean).join(' ');
        }
        return { tagName, attribs: out };
      }
    },

    // Don’t allow style attributes (prefer classes)
    allowVulnerableTags: false,
    // Keep empty tags only if meaningful
    nonTextTags: ['style', 'script', 'textarea', 'option'],
    exclusiveFilter(frame) {
      // Drop empty paragraphs
      if (frame.tag === 'p' && !frame.text.trim() && frame.tagPosition === 0) return true;
      return false;
    }
  });
}
