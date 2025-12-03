import posts from '@/data/posts';
import Link from 'next/link';
import Hero from '@/components/hero';

export default function Home() {
  return (
    <div className="container mx-auto py-2">
      <Hero posts={posts} />

      <section className="px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>

        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.slug} className="p-4 border rounded hover:shadow-sm">
              <Link href={`/posts/${p.slug}`}>
                <h3 className="text-xl font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-500">{p.date}</p>
                <p className="mt-2 text-gray-700">{p.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
