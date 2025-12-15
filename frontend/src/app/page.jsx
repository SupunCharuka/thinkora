import Link from 'next/link';
import Hero from '@/components/hero';
import Trending from '@/components/trending';
import MostViewed from '@/components/mostViewed';
import Latest from '@/components/latest';

export default async function Home() {
  const base = process.env.NEXT_PUBLIC_API_URL || '';
  let heroBlogs = [];
  try {
    const res = await fetch(`${base}/api/v1/blogs?hero=true&limit=4`, { cache: 'no-store' });
    if (res.ok) heroBlogs = await res.json();
  } catch (err) {
    // fail silently and render fallback
    console.error('Failed to fetch hero blogs', err);
  }

  return (
    <div className="container mx-auto py-2">
      <Hero blogs={heroBlogs} />

      <Trending />

      <MostViewed />

      <Latest />

    </div>
  );
}
