import posts from '@/data/posts';

export default function PostsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Posts</h1>
      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.slug} className="p-4 border rounded hover:shadow-sm">
            <a href={`/posts/${p.slug}`}>
              <h2 className="text-2xl font-semibold">{p.title}</h2>
              <p className="text-sm text-gray-500">{p.date}</p>
              <p className="mt-2 text-gray-700">{p.excerpt}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
