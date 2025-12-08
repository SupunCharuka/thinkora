"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Trending() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

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

  return (
    <section
      ref={ref}
      className={`transform transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
    >
      <div className="rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              

              <div>
                <h3 className="text-3xl font-bold">Top Trending</h3>
                <p className="text-sm text-gray-500">Today's Most Popular Stories</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Journey to Mars: The Future of Space Exploration',
              category: 'Technology',
              author: 'Dr. Michael Chen',
              meta: 'May 15, 2025',
              img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=60',
              likes: '3.5k',
              comments: '67',
            },
            {
              title: 'The Future of AI: Breakthroughs and Challenges',
              category: 'Music',
              author: 'Emma Green',
              meta: 'Jan 20, 2025',
              img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=60',
              likes: '3.7k',
              comments: '67',
            },
            {
              title: 'Behind the Beats: Hip Hop Production Masterclass',
              category: 'Wellness',
              author: 'Maria Rodriguez',
              meta: 'Jan 20, 2025',
              img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=60',
              likes: '3.5k',
              comments: '78',
              isVideo: true,
            },
            {
              title: 'Sustainable Living: Eco-Friendly Home Ideas',
              category: 'Lifestyle',
              author: 'Sophia Lee',
              meta: 'Feb 10, 2025',
              img: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=60',
              likes: '4.1k',
              comments: '89',
            },
            {
              title: 'Culinary Journeys: Exploring World Cuisines',
              category: 'Food',
              author: 'Liam Johnson',
              meta: 'Mar 5, 2025',
              img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=60',
              likes: '2.9k',
              comments: '45',
            },
            {
              title: 'The Art of Minimalist Living: Less is More',
              category: 'Design',
              author: 'Olivia Brown',
              meta: 'Apr 12, 2025',
              img: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1400&q=60',
              likes: '3.8k',
              comments: '72',
            },
          ].slice(0, 8).map((post, idx) => (
            <article
              key={idx}
              className="relative rounded-lg overflow-hidden shadow-md transform transition-all duration-300 ease-out group hover:shadow-xl hover:scale-105"
            >
              <Link href={`/posts/${post.slug || '#'}`} className="block">
                <div className="w-full h-[420px] relative rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={post.img}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-colors duration-300 group-hover:from-black/80" />

                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-2 bg-yellow-300 text-black text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-black inline-block" />
                      {post.category}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-4 right-4">
                    <h4 className="text-white text-2xl sm:text-xl font-bold leading-tight drop-shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                      <span className="inline-block">{post.title}</span>
                      <span className="block h-[2px] bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-2" aria-hidden="true" />
                    </h4>
                    <p className="text-sm text-white/90 mt-2 drop-shadow-sm opacity-95">{post.author} · {post.meta}</p>
                  </div>

                  {post.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110">
                        <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M5 3v18l15-9L5 3z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Link
          href="/trending"
          aria-label="Show more trending articles"
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
