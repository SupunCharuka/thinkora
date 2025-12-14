"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";
import Link from 'next/link';
import Image from 'next/image';
import useDashboardAuth from '@/hooks/useDashboardAuth';

export default function ViewBlogsPage() {
    const { loading: checking, data } = useDashboardAuth();
    const [refreshKey, setRefreshKey] = useState(0);
    const [blogs, setBlogs] = useState([]);
    const [loadingBlogs, setLoadingBlogs] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (checking) return;
        if (!data || !data.userId) {
            setBlogs([]);
            return;
        }

        let cancelled = false;
        const load = async () => {
            setLoadingBlogs(true);
            setError(null);
                try {
                const res = await fetch('/api/v1/dashboard/blogs', { credentials: 'include' });
                if (!res.ok) throw new Error(`Failed to load blogs (${res.status})`);
                const all = await res.json();
                if (cancelled) return;
                const userId = String(data.userId);
                const mine = (all || []).filter(b => {
                    const authorId = b?.author?._id || b?.author || null;
                    return authorId && String(authorId) === userId;
                });
                setBlogs(mine);
            } catch (err) {
                if (!cancelled) setError(err.message || 'Failed to load blogs');
            } finally {
                if (!cancelled) setLoadingBlogs(false);
            }
        };

        load();
        return () => { cancelled = true; };
    }, [checking, data, refreshKey]);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center">Loading…</div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <div className="flex">
                <aside className="w-64 hidden md:block">
                    <Sidebar />
                </aside>
                <main className="flex-1 p-6">
                    <Topbar />
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">My Blogs</h2>
                            <div>
                                <button
                                    onClick={() => setRefreshKey(k => k + 1)}
                                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm"
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-md p-4">
                            {loadingBlogs ? (
                                <p>Loading blogs…</p>
                            ) : error ? (
                                <p className="text-red-600">{error}</p>
                            ) : blogs.length === 0 ? (
                                <p>No blogs found for your account.</p>
                            ) : (
                                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                    {blogs.map((b) => {
                                        const baseUrl = (process.env.NEXT_PUBLIC_API_URL).replace(/\/$/, '');
                                        const image = b.image
                                            ? (/^https?:\/\//i.test(b.image) ? b.image : `${baseUrl}${b.image.startsWith('/') ? '' : '/'}${b.image}`)
                                            : '/images/placeholder.svg';
                                        const category = b?.category?.name || b?.category || 'Uncategorized';
                                        const author = b?.author?.name || b?.author || 'Unknown';
                                        const readTime = Math.max(1, Math.round((b.content || '').split(/\s+/).length / 200)) + ' min read';
                                        return (
                                            <article key={b._id || b.slug} className="group relative rounded-lg overflow-hidden shadow-lg cursor-pointer">
                                                <Link href={`/blogs/${b.slug}`} className="absolute inset-0 z-10 focus:outline-none focus:ring-4 focus:ring-blue-500" aria-label={b.title} />
                                                <div role="img" aria-label={b.title} className="block relative h-64 sm:h-72 md:h-80 lg:h-[420px] overflow-hidden bg-gray-100 rounded-lg">
                                                    <Image
                                                        src={image}
                                                        alt={b.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                        unoptimized
                                                        sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                                                    />
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 group-hover:from-black/80"></div>

                                                <div className="absolute top-4 left-4">
                                                    <span className="inline-flex items-center gap-2 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
                                                        <span className="w-2 h-2 rounded-full bg-black inline-block" />
                                                        {category}
                                                    </span>
                                                </div>

                                               

                                                <div className="absolute left-5 bottom-5 right-5 text-white">
                                                    <h3 className="text-white text-2xl sm:text-xl font-bold leading-tight drop-shadow-lg mb-2 transition-all duration-300 group-hover:-translate-y-1 max-h-[4.5rem] overflow-hidden">
                                                        <span className="inline-block">{b.title}</span>
                                                        <span className="block h-[2px] bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-2" aria-hidden="true" />
                                                    </h3>
                                                    <div className="text-sm text-white/80">by {author} · <time dateTime={new Date(b.createdAt).toISOString()}>{new Date(b.createdAt).toLocaleDateString()}</time></div>
                                                    {b.excerpt && (
                                                        <p className="mt-2 text-sm text-white/90 max-w-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">{b.excerpt}</p>
                                                    )}
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}