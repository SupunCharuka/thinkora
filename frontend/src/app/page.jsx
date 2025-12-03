import posts from '@/data/posts';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to My Blog</h1>

      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.slug} className="p-4 border rounded hover:shadow-sm">
            <Link href={`/posts/${p.slug}`}>
              <h2 className="text-2xl font-semibold">{p.title}</h2>
              <p className="text-sm text-gray-500">{p.date}</p>
              <p className="mt-2 text-gray-700">{p.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
