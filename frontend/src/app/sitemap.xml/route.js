export async function GET() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thinkora.me';
    const base = (process.env.NEXT_PUBLIC_API_URL || siteUrl).replace(/\/$/, '');

    // try to fetch blog list from backend; fall back to minimal sitemap on failure
    let items = [
        { url: '/', priority: 1.0 },
        { url: '/blogs', priority: 0.9 },
        { url: '/about', priority: 0.5 },
        { url: '/contact', priority: 0.5 },
    ];

    try {
        // Use ISR so Next can prerender the sitemap and revalidate periodically.
        // Set revalidate to an appropriate interval (seconds). 3600 = 1 hour.
        const res = await fetch(`${base}/api/v1/blogs?limit=1000`, { next: { revalidate: 3600 } });
        if (res.ok) {
            const data = await res.json();
            const mapped = (data || []).map((b) => {
                const slug = b.slug || b._id || b.id;
                const loc = `${siteUrl.replace(/\/$/, '')}/blogs/${encodeURIComponent(slug)}`;
                const lastmod = b.updatedAt || b.createdAt || null;
                return { url: loc, lastmod };
            });
            items = items.concat(mapped);
        }
    } catch (e) {
        // ignore and continue with defaults
        console.warn('sitemap: failed to fetch blogs', e);
    }

    const xmlItems = items
        .map((it) => {
            const lastmod = it.lastmod ? `<lastmod>${new Date(it.lastmod).toISOString()}</lastmod>` : '';
            const loc = (/^https?:\/\//i.test(it.url)) ? it.url : `${siteUrl.replace(/\/$/, '')}${it.url.startsWith('/') ? it.url : `/${it.url}`}`;
            return `  <url>\n    <loc>${loc}</loc>\n    ${lastmod}\n  </url>`;
        })
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlItems}\n</urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=0, s-maxage=3600',
        },
    });
}
