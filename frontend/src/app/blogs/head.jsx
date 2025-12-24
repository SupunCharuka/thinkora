export default function Head() {
  const siteUrl = 'https://thinkora.me';
  const title = 'Thinkora - Blogs';
  const description = 'Browse articles, tutorials and stories about technology, travel, music and lifestyle on thinkora.';
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "thinkora",
        "url": `${siteUrl}`,
        "description": description,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteUrl}/blogs?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "name": "thinkora",
        "url": `${siteUrl}`,
        "logo": `${siteUrl}/favicon.svg`
      }
    ]
  };

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="thinkora, blog, technology, travel, music, tutorials, articles" />
      <link rel="canonical" href={`${siteUrl}/blogs`} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${siteUrl}/blogs`} />
      <meta property="og:site_name" content="thinkora" />
      <meta property="og:image" content={`${siteUrl}/og-image.png`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}/og-image.png`} />

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
