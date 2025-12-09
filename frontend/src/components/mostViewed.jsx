"use client";
import Link from 'next/link';
import Image from 'next/image';
import articles from '@/data/articles';
import { useEffect, useRef, useState } from 'react';

export default function MostViewed() {

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

    const sampleImages = [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=60',
        'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1400&q=60',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=60',
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=60',
    ];

    const main = articles[0] || { title: 'Mastering French Cuisine: A Complete Guide', category: 'Architecture', date: 'Mar 5, 2025', slug: 'mastering-french-cuisine' };
    const side = articles.slice(1, 5);

    return (
        <section
            ref={ref}
            className={`mt-6 transform transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                `}
        >

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Most viewed articles</h2>
                    <p className="text-sm text-gray-500">Explore the most viewed articles</p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {articles.slice(0, 4).map((p, i) => (
                    <article key={p.slug || i} className="relative rounded-lg overflow-hidden shadow-md transform transition-all duration-300 ease-out group hover:shadow-xl hover:scale-105">
                        <Link href={p.slug ? `/articles/${p.slug}` : '#'} className="group block rounded-lg overflow-hidden shadow-lg">
                            <div className="w-full h-[420px] relative bg-gray-100">
                                <Image
                                    src={p.image || sampleImages[i % sampleImages.length]}
                                    alt={p.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-colors duration-300 group-hover:from-black/80" />

                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center gap-2 bg-yellow-300 text-black text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                                        <span className="w-2 h-2 rounded-full bg-black inline-block" />
                                        {p.category || 'General'}
                                    </span>
                                </div>

                                <div className="absolute top-4 right-4">
                                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-4 right-4">
                                    <h3 className="text-white text-2xl sm:text-xl font-bold leading-tight drop-shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                                        <span className="inline-block">{p.title}</span>
                                        <span className="block h-[2px] bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-2" aria-hidden="true" />
                                    </h3>
                                    <p className="text-sm text-white/90 mt-2 drop-shadow-sm opacity-95">{p.author || 'Unknown'} · {p.date || 'Jan 1, 2025'}</p>
                                </div>

                                {p.isVideo && (
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
