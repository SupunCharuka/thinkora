"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Highlight() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const base = process.env.NEXT_PUBLIC_API_URL || '';

    async function fetchHighlights() {
      try {
        const res = await fetch(`${base}/api/v1/blogs?highlighted=true&limit=8`);
        if (!res.ok) throw new Error('Failed to load highlights');
        const data = await res.json();
        if (mounted) setItems(data || []);
      } catch (err) {
        console.error('Failed to fetch highlights', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchHighlights();
    return () => { mounted = false; };
  }, []);

  const formatDate = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

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
            (items || []).map((blog, idx) => (
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
        <Link
          href="/trending"
          aria-label="Show more trending blogs"
          className="group inline-flex items-center gap-3 bg-[#0b1220] hover:bg-gradient-to-r hover:from-[#0b1220] hover:to-[#0f1724] text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
        >
          <span className="text-sm font-medium transition-colors duration-200">Show me more</span>

          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 transition-transform duration-200 transform group-hover:translate-x-1 group-hover:bg-white/10">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        </Link>
      </div>

    </section>
  );
}
