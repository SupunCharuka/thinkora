"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Highlight() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(4);
  const base = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    async function fetchHighlights() {
      try {
        const res = await fetch(`${base}/api/v1/blogs?highlighted=true&limit=${limit}`);
        if (!res.ok) throw new Error('Failed to load highlights');
        const data = await res.json();
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch highlights', err);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchHighlights();
    return () => { mounted = false; };
  }, [limit]);

  const formatDate = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const truncate = (str, n = 140) => {
    if (!str) return '';
    const s = String(str).trim();
    return s.length > n ? `${s.slice(0, n - 1).trim()}…` : s;
  };


  const hasMore = Array.isArray(items) && items.length >= limit && items.length > 0;

  return (
    <section
      ref={ref}
      className={`transform transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} `}
    >
      <div className="rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-3xl font-bold">Top Highlight</h3>
                <p className="text-sm text-gray-500">Today's Most Popular Stories</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-[420px] bg-gray-100 rounded-lg animate-pulse" />
            ))
          ) : (
            (items || []).slice(0, limit).map((blog, idx) => (
              <article
                key={blog._id || blog.slug || idx}
                className="relative rounded-lg overflow-hidden shadow-md transform transition-all duration-300 ease-out group hover:shadow-xl hover:scale-105"
              >
                <Link href={blog.slug ? `/blogs/${blog.slug}` : '#'} className="block">
                  <div className="w-full h-[420px] relative rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={blog.image || '/images/placeholder.svg'}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-colors duration-300 group-hover:from-black/80" />

                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-2 bg-yellow-300 text-black text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-black inline-block" />
                        {blog.category && (typeof blog.category === 'object' ? blog.category.name : blog.category)}
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-4 right-4">
                      {/* Excerpt: show only on hover as a creative overlay (above the title) */}
                      {blog.excerpt ? (
                        <div className="mb-2">
                          <div className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <div className="bg-black/60 backdrop-blur-sm p-3 rounded-md">
                              <p className="text-sm text-white/90 leading-relaxed">{truncate(blog.excerpt, 160)}</p>
                            </div>
                          </div>
                        </div>
                      ) : null}
                      <h4 className="text-white text-2xl sm:text-xl font-bold leading-tight drop-shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                        <span className="inline-block">{blog.title}</span>
                        <span className="block h-[2px] bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-2" aria-hidden="true" />
                      </h4>
                      <p className="text-sm text-white/90 mt-2 drop-shadow-sm opacity-95">{formatDate(blog.createdAt || blog.date)}</p>
                    </div>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="flex items-center gap-3">
          {limit > 4 && (
            <button
              type="button"
              onClick={() => setLimit((p) => Math.max(4, p - 4))}
              disabled={loading}
              aria-label="Show fewer highlights"
              className="group inline-flex items-center gap-3 bg-white text-[#0b1220] px-4 py-2 rounded-full shadow-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
            >
              <span className="text-sm font-medium transition-colors duration-200">{loading ? 'Loading...' : 'Show less'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setLimit((p) => p + 4)}
            disabled={loading || !hasMore}
            aria-label="Load more highlights"
            className="group inline-flex items-center gap-3 bg-[#0b1220] hover:bg-gradient-to-r hover:from-[#0b1220] hover:to-[#0f1724] text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
          >
            <span className="text-sm font-medium transition-colors duration-200">{loading ? 'Loading...' : (hasMore ? 'Load more' : 'No more')}</span>

            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 transition-transform duration-200 transform group-hover:translate-x-1 group-hover:bg-white/10">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
          </button>
        </div>
      </div>

    </section>
  );
}
