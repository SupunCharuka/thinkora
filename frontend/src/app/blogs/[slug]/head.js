export async function generateMetadata({ params }) {
  const slug = params?.slug;
  const base = process.env.NEXT_PUBLIC_API_URL;

  if (!slug) return { title: 'Blog — My Blog' };

  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/api/v1/blogs/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    if (!res.ok) return { title: 'Blog — My Blog' };
    const data = await res.json();
    const blog = data || {};

    const title = blog.title ? `${blog.title} — My Blog` : 'Blog — My Blog';
    const description = blog.excerpt || blog.summary || '';

    let image = blog.image || '';
    if (image && image.startsWith('/') && base) {
      image = base.replace(/\/$/, '') + image;
    }

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: (process.env.NEXT_PUBLIC_SITE_URL || base) ? `${(process.env.NEXT_PUBLIC_SITE_URL || base).replace(/\/$/, '')}/blogs/${encodeURIComponent(slug)}` : undefined,
        images: image ? [{ url: image }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch (err) {
    return { title: 'Blog — My Blog' };
  }
}

export default function Head() {
  return null;
}
