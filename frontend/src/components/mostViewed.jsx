"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// Fetch most viewed blogs from backend instead of using local sample data

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

    // removed sampleImages - use placeholder when no image provided

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const STEP = 4;
    const [visibleCount, setVisibleCount] = useState(STEP);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        async function load() {
            try {
                const base = process.env.NEXT_PUBLIC_API_URL || '';
                // fetch a reasonable number to paginate client-side
                const res = await fetch(`${base}/api/v1/blogs?mostViewed=1&limit=12`);
                if (!res.ok) throw new Error('Failed to load most viewed');
                const data = await res.json();
                if (!mounted) return;
                const mapped = (data || []).map((b) => ({
                    _id: b._id,
                    title: b.title,
                    category: (b.category && b.category.name) || b.category || 'General',
                    createdAt: b.createdAt || b.date || null,
                    slug: b.slug || b._id,
                    image: b.image || null,
                    author: (b.author && b.author.name) || 'Unknown',
                    views: typeof b.views === 'number' ? b.views : 0,
                    excerpt: b.excerpt || '',
                    highlighted: !!b.highlighted,
                }));
                setItems(mapped);
            } catch (e) {
                setItems([]);
                console.warn('MostViewed load failed', e);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        return () => { mounted = false };
    }, []);

    const formatDate = (value) => {
        if (!value) return '';
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return String(value);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const truncate = (str, n = 160) => {
        if (!str) return '';
        const s = String(str).trim();
        return s.length > n ? `${s.slice(0, n - 1).trim()}…` : s;
    };

    return (
        <section
            ref={ref}
            className={`transform transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                `}
        >

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Most Viewed Blogs</h2>
                    <p className="text-sm text-gray-500">Explore the most viewed blogs</p>
                </div>
            </div>

            <div className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {loading ? (
                        Array.from({ length: STEP }).map((_, idx) => (
                            <div key={`s-${idx}`} className="h-[420px] bg-gray-100 rounded-lg animate-pulse" />
                        ))
                    ) : (
                        (items || []).slice(0, visibleCount).map((p, i) => (
                            <article key={p._id || p.slug || i} className="relative rounded-lg overflow-hidden shadow-md transform transition-all duration-300 ease-out group hover:shadow-xl hover:scale-105">
                                <Link href={p.slug ? `/blogs/${p.slug}` : '#'} className="group block rounded-lg overflow-hidden shadow-lg">
                                    <div className="w-full h-[420px] relative bg-gray-100">
                                        <Image
                                            src={p.image || '/images/placeholder.svg'}
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

                                        <div className="absolute bottom-6 left-4 right-4">
                                            {p.excerpt ? (
                                                <div className="mb-2">
                                                    <div className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                                        <div className="bg-black/60 backdrop-blur-sm p-3 rounded-md">
                                                            <p className="text-sm text-white/90 leading-relaxed">{truncate(p.excerpt, 160)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}
                                            <h3 className="text-white text-2xl sm:text-xl font-bold leading-tight drop-shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                                                <span className="inline-block">{p.title}</span>
                                                <span className="block h-[2px] bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-2" aria-hidden="true" />
                                            </h3>
                                            <p className="text-sm text-white/90 mt-2 drop-shadow-sm opacity-95">{formatDate(p.createdAt)}</p>
                                        </div>

                                        {p.highlighted && (
                                            <div className="absolute top-4 right-4">
                                                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </article>
                        ))
                    )}
                </div>
            </div>

            <div className="py-6 flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                    {visibleCount > STEP && (
                        <button
                            type="button"
                            onClick={() => setVisibleCount((p) => Math.max(STEP, p - STEP))}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-800 shadow-sm hover:shadow-md"
                        >
                            Show less
                        </button>
                    )}

                    {visibleCount < (items?.length || 0) && (
                        <button
                            type="button"
                            onClick={() => setVisibleCount((p) => Math.min(p + STEP, items.length))}
                            disabled={loading}
                            aria-label="Load more most viewed"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0b1220] text-white shadow-lg hover:scale-105"
                        >
                            <span className="text-sm font-medium transition-colors duration-200">{loading ? 'Loading...' : 'Load more'}</span>

                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 transition-transform duration-200 transform group-hover:translate-x-1 group-hover:bg-white/10">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
