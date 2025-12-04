"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import posts from '@/data/posts';

export default function Latest() {
  const sampleImages = [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=60',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=60',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1400&q=60',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=60',
  ];

  const authors = [
    { name: 'Sarah Wilson', role: 'Marketing Manager', avatar: 'https://i.pravatar.cc/48?img=3' },
    { name: 'Dr. Michael Chen', role: 'AI Researcher', avatar: 'https://i.pravatar.cc/48?img=12' },
    { name: 'Emma Green', role: 'Environmental Consultant', avatar: 'https://i.pravatar.cc/48?img=5' },
  ];

  const categories = [
    { name: 'Garden', count: 13 },
    { name: 'Technology', count: 25 },
    { name: 'Fitness', count: 18 },
    { name: 'Finance', count: 22 },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(2);
  const totalPages = 16;

  const getPages = (current, total) => {
    // Returns an array of page numbers and '...' markers (as strings)
    const pages = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (current > 4) {
      pages.push('left-ellipsis');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 3) {
      pages.push('right-ellipsis');
    }

    pages.push(total);
    return pages;
  };

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Latest articles</h2>
          <p className="text-sm text-gray-500">Over 2000+ articles</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.concat(posts).slice(0,8).map((post, idx) => (
              <article key={post.slug + idx} className="relative rounded-2xl overflow-hidden shadow-md group hover:shadow-xl transform transition-all duration-300 hover:scale-[1.03]">
                <Link href={`/posts/${post.slug}`} className="block">
                  <div className="w-full h-52 relative">
                    <Image
                      src={sampleImages[idx % sampleImages.length]}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    <div className="absolute top-4 left-4">
                      <span className="inline-block bg-white/90 text-xs text-blue-700 px-3 py-1 rounded-full font-medium">{post.category}</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-lg font-semibold leading-tight">{post.title}</h3>
                      <p className="text-sm text-white/90 mt-2">Admin · {post.date} · 3 min read</p>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-8">
            <nav aria-label="Pagination">
              <div className="flex items-center text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 focus:ring-2 focus:ring-blue-200'}`}
                  >
                    ← Previous
                  </button>
                </div>

                <div className="flex-1 flex items-center justify-center gap-2">
                  <div className="hidden sm:flex items-center gap-3">
                    {getPages(currentPage, totalPages).map((p, i) => {
                      if (typeof p === 'string' && p.includes('ellipsis')) {
                        return (
                          <span key={`e-${i}`} className="px-2 text-gray-400 select-none">…</span>
                        );
                      }

                      const isCurrent = p === currentPage;

                      return (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          aria-current={isCurrent ? 'page' : undefined}
                          className={`transition transform duration-150 inline-flex items-center justify-center ${isCurrent ? 'bg-white text-black rounded-lg px-3 py-2 shadow-md ring-1 ring-gray-200' : 'text-gray-700 px-3 py-2 rounded-md hover:bg-gray-50 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-blue-200'}`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                  {/* Small-screen condensed view */}
                  <div className="sm:hidden flex items-center gap-2 text-sm">
                    <span className="text-gray-600">{currentPage}</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600">{totalPages}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-md text-sm ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 focus:ring-2 focus:ring-blue-200'}`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Hottest authors</h4>
              <Link href="#" className="text-sm text-gray-500">View all</Link>
            </div>

            <div className="space-y-3">
              {authors.map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Image src={a.avatar} alt={a.name} width={40} height={40} className="rounded-full" />
                  <div>
                    <div className="text-sm font-medium">{a.name}</div>
                    <div className="text-xs text-gray-500">{a.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Suggested categories</h4>
              <Link href="#" className="text-sm text-gray-500">View all</Link>
            </div>

            <div className="space-y-3">
              {categories.map((c, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-indigo-100 rounded-lg flex items-center justify-center text-sm">{c.name[0]}</div>
                    <div>
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.count} articles</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Popular posts</h4>
              <Link href="#" className="text-sm text-gray-500">View all</Link>
            </div>

            <ul className="space-y-3">
              {posts.slice(0,4).map((p, i) => (
                <li key={p.slug} className="flex items-center gap-3">
                  <div className="w-12 h-12 relative rounded overflow-hidden">
                    <Image src={sampleImages[i % sampleImages.length]} alt={p.title} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{p.title}</div>
                    <div className="text-xs text-gray-500">{p.date}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
