export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thinkora.me';
  const sitemapUrl = `${siteUrl.replace(/\/$/, '')}/sitemap.xml`;
  const txt = `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`;
  return new Response(txt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
