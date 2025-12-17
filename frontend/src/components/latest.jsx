"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Latest() {

    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const base = process.env.NEXT_PUBLIC_API_URL || '';
    const STEP = 4;
    const [visibleCount, setVisibleCount] = useState(4);


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
        async function fetchLatest() {
            try {
                const res = await fetch(`${base}/api/v1/blogs`);
                if (!res.ok) throw new Error('Failed to fetch latest blogs');
                const data = await res.json();
                if (mounted) setItems(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to load latest blogs', err);
                if (mounted) setItems([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchLatest();
        return () => { mounted = false; };
    }, [base]);

    const formatDate = (v) => {
        if (!v) return '';
        const d = new Date(v);
        if (Number.isNaN(d.getTime())) return String(v);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const truncate = (str, n = 140) => {
        if (!str) return '';
        const s = String(str).trim();
        return s.length > n ? `${s.slice(0, n - 1).trim()}…` : s;
    };

    const hasMore = Array.isArray(items) && items.length > (visibleCount || 0);

    return (
        <section
            ref={ref}
            className={`transform transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Latest Blogs</h2>
                    <p className="text-sm text-gray-500">Latest published stories</p>
                </div>
            </div>

            <div className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {loading ? (
                        Array.from({ length: STEP }).map((_, idx) => (
                            <div key={idx} className="h-[420px] bg-gray-100 rounded-lg animate-pulse" />
                        ))
                    ) : (items.length === 0) ? (
                        <div className="col-span-full text-center text-gray-500 py-20">No recent blogs.</div>
                    ) : (
                        (items || []).slice(0, visibleCount).map((blog, idx) => {
                            const imgRaw = blog.image || blog.img || '';
                            let imgSrc = imgRaw;
                            if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('//')) {
                                if (!imgSrc.startsWith('/')) imgSrc = `/${imgSrc}`;
                                imgSrc = `${base}${imgSrc}`;
                            }
                            const authorName = blog.author && (blog.author.name || blog.author) ? (blog.author.name || blog.author) : '';
                            return (
                                <article key={blog._id || blog.slug || idx} className="relative rounded-lg overflow-hidden shadow-md transform transition-all duration-300 ease-out group hover:shadow-xl hover:scale-105">
                                    <Link href={`/blogs/${blog.slug || ''}`} className="group block rounded-lg overflow-hidden shadow-lg">
                                        <div className="w-full h-[420px] relative rounded-lg overflow-hidden bg-gray-100">
                                            {imgSrc ? (
                                                <Image
                                                    src={imgSrc}
                                                    alt={blog.title}
                                                    fill
                                                    unoptimized
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gray-200" />
                                            )}

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

                                                <h3 className="text-white text-lg sm:text-xl font-bold leading-tight drop-shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                                                    <span className="inline-block">{blog.title}</span>
                                                    <span className="block h-[2px] bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-2" aria-hidden="true" />
                                                </h3>

                                                <p className="text-sm text-white/90 mt-2 drop-shadow-sm opacity-95">{formatDate(blog.createdAt || blog.date)}</p>
                                            </div>

                                            {blog.isVideo && (
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
                            );
                        })
                    )}
                </div>

                <div className="py-6 flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3">
                        {visibleCount > STEP && (
                            <button
                                type="button"
                                onClick={() => setVisibleCount((p) => Math.max(STEP, p - STEP))}
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-800 shadow-sm hover:shadow-md"
                            >
                                Show less
                            </button>
                        )}

                        {visibleCount < (items?.length || 0) && (
                            <button
                                type="button"
                                onClick={() => setVisibleCount((p) => Math.min(p + STEP, items.length))}
                                disabled={loading || !hasMore}
                                aria-label="Load more highlights"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0b1220] text-white shadow-lg hover:scale-105"
                            >
                                <span className="text-sm font-medium transition-colors duration-200">{loading ? 'Loading...' : (hasMore ? 'Load more' : 'No more')}</span>

                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 transition-transform duration-200 transform group-hover:translate-x-1 group-hover:bg-white/10">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
