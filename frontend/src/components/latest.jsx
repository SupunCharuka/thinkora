"use client";
import Link from 'next/link';
import Image from 'next/image';
import posts from '@/data/posts';
import { useEffect, useRef, useState } from 'react';

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
            className={`mt-6 transform transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Latest articles</h2>
                    <p className="text-sm text-gray-500">Over 2000+ articles</p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main grid */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {posts.concat(posts).slice(0, 8).map((post, idx) => {
                            const author = authors[idx % authors.length];
                            return (
                                <article key={post.slug + idx} className="relative rounded-lg overflow-hidden shadow-md transform transition-all duration-300 ease-out group hover:shadow-xl hover:scale-105">
                                    <Link href={`/posts/${post.slug}`} className="block">
                                        <div className="w-full h-[420px] relative rounded-lg overflow-hidden bg-gray-100">
                                            <Image
                                                src={sampleImages[idx % sampleImages.length]}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                                                <h3 className="text-white text-2xl sm:text-xl font-bold leading-tight drop-shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                                                    <span className="inline-block">{post.title}</span>
                                                    <span className="block h-[2px] bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-2" aria-hidden="true" />
                                                </h3>
                                                <p className="text-sm text-white/90 mt-2 drop-shadow-sm opacity-95">{author.name} · {post.date}</p>
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
                            );
                        })}
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
                    {/* Hottest authors */}
                    <div className="rounded-2xl bg-white shadow p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-lg">Hottest authors</h4>
                            <Link href="#" className="text-sm text-gray-500 inline-flex items-center gap-1">View all <span aria-hidden>→</span></Link>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {authors.map((a, i) => (
                                <div
                                    key={i}
                                    role="button"
                                    tabIndex={0}
                                    className="flex items-center gap-3 py-4 px-2 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                >
                                    <Image src={a.avatar} alt={a.name} width={44} height={44} className="rounded-full object-cover" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-800">{a.name}</div>
                                        <div className="text-xs text-gray-500">{a.role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Suggested categories */}
                    <div className="rounded-2xl bg-white shadow p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-lg">Suggested categories</h4>
                            <Link href="#" className="text-sm text-gray-500 inline-flex items-center gap-1">View all <span aria-hidden>→</span></Link>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {categories.map((c, i) => (
                                <div
                                    key={i}
                                    role="button"
                                    tabIndex={0}
                                    className="flex items-center gap-3 py-4 px-2 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-indigo-100 rounded-lg flex items-center justify-center overflow-hidden">
                                        <span className="text-sm font-medium text-gray-800">{c.name[0]}</span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-800">{c.name}</div>
                                        <div className="text-xs text-gray-500">{c.count} articles</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Popular posts */}
                    <div className="rounded-2xl bg-white shadow p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-lg">Popular posts</h4>
                            <Link href="#" className="text-sm text-gray-500 inline-flex items-center gap-1">View all <span aria-hidden>→</span></Link>
                        </div>

                        <ul className="divide-y divide-gray-100">
                            {posts.slice(0, 4).map((p, i) => (
                                <li
                                    key={p.slug}
                                    role="button"
                                    tabIndex={0}
                                    className="flex items-center justify-between gap-3 py-4 px-2 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="text-xs text-gray-500">John Doe · Jun 10, 2025</div>
                                            <div className="text-sm font-medium text-gray-800">{p.title.length > 40 ? p.title.slice(0, 40) + '...' : p.title}</div>
                                        </div>
                                    </div>

                                    <div className="w-16 h-12 relative rounded overflow-hidden flex-shrink-0">
                                        <Image src={sampleImages[i % sampleImages.length]} alt={p.title} fill className="object-cover" />
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
