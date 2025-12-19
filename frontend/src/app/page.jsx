import Hero from '@/components/hero';
import Highlight from '@/components/highlight';
import MostViewed from '@/components/mostViewed';
import Latest from '@/components/latest';

export default async function Home() {
  const base = process.env.NEXT_PUBLIC_API_URL || '';
  let heroBlogs = [];
  try {
    const res = await fetch(`${base}/api/v1/blogs?hero=true&limit=4`, { next: { revalidate: 60 } });
    if (res.ok) heroBlogs = await res.json();
  } catch (err) {
    // fail silently and render fallback
    console.error('Failed to fetch hero blogs', err);
  }

  return (
    <div className="container mx-auto py-2">
      {heroBlogs && heroBlogs.length > 0 ? (
        <Hero blogs={heroBlogs} />
      ) : (
        <div className="animate-pulse py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="col-span-1 lg:col-span-2 h-64 bg-slate-200 rounded-lg" />
            <div className="hidden lg:block h-64 bg-slate-200 rounded-lg" />
            <div className="hidden lg:block h-64 bg-slate-200 rounded-lg" />
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="h-36 bg-slate-200 rounded-md" />
            <div className="h-36 bg-slate-200 rounded-md" />
            <div className="h-36 bg-slate-200 rounded-md" />
            <div className="h-36 bg-slate-200 rounded-md" />
          </div>
        </div>
      )}

      <Highlight />

      <MostViewed />

      <Latest />

    </div>
  );
}
