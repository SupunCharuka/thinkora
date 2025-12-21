export default async function Head({ params }) {
  const slug = params?.slug;
  const siteUrl = 'https://thinkora.me';
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

  let blog = null;
  try {
    const url = apiBase ? `${apiBase}/api/v1/blogs/${encodeURIComponent(slug)}` : `${siteUrl}/api/v1/blogs/${encodeURIComponent(slug)}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) blog = await res.json();
  } catch (e) {
    // silent fallback to minimal metadata
  }

  const title = blog?.title || 'Blog — thinkora';
  const description = blog?.excerpt || blog?.description || 'Read articles, tutorials and stories on thinkora.';
  const image = blog?.image ? (blog.image.startsWith('/') ? `${apiBase || siteUrl}${blog.image}` : blog.image) : `${siteUrl}/og-image.png`;
  const author = blog?.author?.name || 'thinkora';
  const datePublished = blog?.createdAt || blog?.date || undefined;

  // compute word count and estimated time if content available
  let wordCount = undefined;
  let timeRequired = undefined;
  try {
    if (blog && blog.content) {
      const text = Array.isArray(blog.content) ? blog.content.join(' ') : String(blog.content);
      wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      const minutes = Math.max(1, Math.round(wordCount / 200));
      timeRequired = `PT${minutes}M`;
    }
  } catch (e) { }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": [image],
    "author": { "@type": "Person", "name": author },
    "publisher": { "@type": "Organization", "name": "thinkora", "logo": { "@type": "ImageObject", "url": `${siteUrl}/favicon.svg` } },
    ...(datePublished ? { "datePublished": datePublished } : {}),
    ...(blog?.updatedAt ? { "dateModified": blog.updatedAt } : {}),
    ...(wordCount ? { "wordCount": wordCount } : {}),
    ...(timeRequired ? { "timeRequired": timeRequired } : {}),
    ...(blog?.category ? { "articleSection": (Array.isArray(blog.category) ? (blog.category[0]?.name || blog.category[0]) : (blog.category.name || blog.category)) } : {}),
    "mainEntityOfPage": { "@type": "WebPage", "@id": `${siteUrl}/blogs/${slug}` },
    ...(blog?.tags ? { "keywords": Array.isArray(blog.tags) ? blog.tags.join(', ') : String(blog.tags) } : {})
  };

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${siteUrl}/blogs/${slug}`} />

      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${siteUrl}/blogs/${slug}`} />
      <meta property="og:site_name" content="thinkora" />
      <meta property="og:image" content={image} />
      {datePublished && <meta property="article:published_time" content={datePublished} />}
      {blog?.updatedAt && <meta property="article:modified_time" content={blog.updatedAt} />}
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      {Array.isArray(blog?.category) ? blog.category.map((c) => (
        <meta key={`cat-${String(c)}`} property="article:tag" content={typeof c === 'string' ? c : (c.name || String(c))} />
      )) : (blog?.category ? <meta property="article:tag" content={typeof blog.category === 'string' ? blog.category : (blog.category.name || String(blog.category))} /> : null)}
      {Array.isArray(blog?.tags) ? blog.tags.map((t) => (
        <meta key={`tag-${String(t)}`} property="article:tag" content={String(t)} />
      )) : null}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@thinkora" />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
