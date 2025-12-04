"use client";
import Link from 'next/link';
import Image from 'next/image';
import posts from '@/data/posts';
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

    const main = posts[0] || { title: 'Mastering French Cuisine: A Complete Guide', category: 'Architecture', date: 'Mar 5, 2025', slug: 'mastering-french-cuisine' };
    const side = posts.slice(1, 5);

    return (
        <section
            ref={ref}
            className={`mt-6 transform transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
        >

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Most viewed articles</h2>
                    <p className="text-sm text-gray-500">Explore the most viewed articles</p>
                </div>


            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left large card */}
                <article className="group cursor-pointer bg-white rounded-2xl shadow overflow-hidden relative transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
                    <div className="w-full h-96 rounded-2xl overflow-hidden relative">
                        <Image src={sampleImages[0]} alt={main.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent transition-colors duration-300 group-hover:from-black/20 rounded-2xl" />

                        
                    </div>

                    <div className="mt-4 p-4">
                        <span className="inline-block bg-pink-50 text-pink-600 text-xs px-3 py-1 rounded-full font-medium transition-transform duration-300 group-hover:translate-y-0">{main.category}</span>
                        <h3 className="mt-3 text-2xl font-semibold text-gray-900 transition-transform duration-300 group-hover:-translate-y-1">{main.title}</h3>
                        <p className="mt-2 text-sm text-gray-600">Learn the art of French cooking with step-by-step tutorials from a master chef.</p>

                        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-3">
                                <Image src={'https://i.pravatar.cc/40?img=7'} alt="author" width={36} height={36} className="rounded-full object-cover" />
                                <div>
                                    <div className="text-sm font-medium text-gray-800">David Thompson</div>
                                    <div className="text-xs text-gray-400">{main.date}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-pink-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 010 6.364L12 20.364l7.682-7.682a4.5 4.5 0 10-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> <span className="text-sm">4.1k</span></div>
                                <div className="text-sm text-gray-400">4 min read</div>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Right list of smaller cards */}
                <div className="space-y-4">
                    {side.map((p, i) => (
                        <article key={p.slug || i} className="group cursor-pointer hover:bg-gray-50 transition-all duration-300 transform hover:shadow-xl hover:scale-[1.02] flex items-center justify-between bg-white rounded-2xl shadow p-2 gap-4">
                            <div className="flex-1">
                                <span className="inline-block bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">{p.category || 'Photography'}</span>
                                <h4 className="mt-2 text-sm font-semibold text-gray-900">{p.title.length > 40 ? p.title.slice(0, 40) + '...' : p.title}</h4>
                                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                    <Image src={`https://i.pravatar.cc/40?img=${(i % 70) + 10}`} alt={p.author || 'Author'} width={28} height={28} className="rounded-full object-cover" />
                                    <span>{p.author || 'John Anderson'} · Apr 20, 2025</span>
                                </div>

                                <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                                    <div className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg><span>2.1k</span></div>
                                    <div className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v8l-4-4H7a2 2 0 01-2-2V6a2 2 0 012-2h2" /></svg><span>34</span></div>
                                </div>
                            </div>

                            <div className="w-40 h-28 relative rounded-2xl overflow-hidden flex-shrink-0">
                                <Image src={sampleImages[(i + 1) % sampleImages.length]} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl" />


                            </div>
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
