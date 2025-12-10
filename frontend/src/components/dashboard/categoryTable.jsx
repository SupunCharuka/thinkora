"use client";
import React, { useEffect, useState, useMemo } from 'react';

function formatDate(d) {
    try {
        return new Date(d).toLocaleString();
    } catch (e) {
        return '-';
    }
}

function truncate(str, n = 60) {
    if (!str) return '';
    return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

export default function CategoryTable({ refreshKey }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDir, setSortDir] = useState('desc');
    const [showFilters, setShowFilters] = useState(false);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/v1/categories');
            if (!res.ok) throw new Error('Failed to load');
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch categories', err);
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [refreshKey]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        let arr = categories.slice();
        if (q) {
            arr = arr.filter((c) => (c.name || '').toLowerCase().includes(q) || (c.slug || '').toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q));
        }
        arr.sort((a, b) => {
            const A = a[sortBy] || '';
            const B = b[sortBy] || '';
            if (sortDir === 'asc') return A > B ? 1 : A < B ? -1 : 0;
            return A < B ? 1 : A > B ? -1 : 0;
        });
        return arr;
    }, [categories, query, sortBy, sortDir]);

    return (
        <div className="mt-6 max-w">
            <div className="p-5 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-semibold">Categories</h3>
                        <p className="text-sm text-gray-500">Manage categories used for posts</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Mobile: Filters toggle */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setShowFilters((s) => !s)}
                                className="px-3 py-2 rounded-md border bg-white dark:bg-gray-900 text-sm"
                                aria-expanded={showFilters}
                                aria-controls="mobile-filters"
                            >
                                Filters
                            </button>
                        </div>

                        {/* Desktop controls */}
                        <div className="hidden md:flex items-center gap-3">
                            <div className="relative">
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search categories"
                                    className="w-72 pl-3 pr-10 py-2 rounded-md border border-gray-200 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                               
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="text-xs text-gray-500">Sort</span>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-md border px-2 py-1 bg-white dark:bg-gray-900">
                                    <option value="createdAt">Created</option>
                                    <option value="name">Name</option>
                                    <option value="slug">Slug</option>
                                </select>
                                <button onClick={() => setSortDir((s) => (s === 'asc' ? 'desc' : 'asc'))} className="px-2 py-1 rounded-md border bg-white dark:bg-gray-900">
                                    {sortDir === 'asc' ? '↑' : '↓'}
                                </button>
                            </div>
                        </div>
                    </div>

                    
                </div>

                {/* Mobile filters panel (render under the title on small screens) */}
                {showFilters && (
                    <div id="mobile-filters" className="md:hidden mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search categories"
                                className="w-full pl-3 pr-10 py-2 rounded-md border border-gray-200 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button onClick={() => setShowFilters(false)} className="px-3 py-2 rounded-md border bg-white dark:bg-gray-800">Close</button>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="text-xs text-gray-500">Sort</span>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-md border px-2 py-1 bg-white dark:bg-gray-800">
                                    <option value="createdAt">Created</option>
                                    <option value="name">Name</option>
                                    <option value="slug">Slug</option>
                                </select>
                            </div>

                            <div>
                                <button onClick={() => setSortDir((s) => (s === 'asc' ? 'desc' : 'asc'))} className="px-3 py-2 rounded-md border bg-white dark:bg-gray-800">
                                    {sortDir === 'asc' ? '↑' : '↓'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    {/* Mobile: card list */}
                    <div className="md:hidden p-3">
                        {loading && (
                            <div className="px-4 py-6 text-center text-sm text-gray-500">Loading categories…</div>
                        )}

                        {!loading && error && (
                            <div className="px-4 py-6 text-center text-sm text-red-600">{error}</div>
                        )}

                        {!loading && !error && filtered.length === 0 && (
                            <div className="px-4 py-12 text-center text-sm text-gray-500">No categories found.</div>
                        )}

                        {!loading && !error && filtered.map((c) => (
                            <div key={c._id || c.id} className="mb-3 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-200 font-semibold">{(c.name || '').slice(0, 1).toUpperCase()}</div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{c.name}</div>
                                                <div className="text-xs text-gray-500">{c._id || ''}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right ml-3">
                                        <div className="text-sm text-gray-600 dark:text-gray-300">{c.createdAt ? formatDate(c.createdAt) : '—'}</div>
                                        <div className="mt-2">
                                            <span className="inline-block px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">{c.slug}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-end gap-2">
                                    <button className="px-2 py-1 text-sm rounded-md border bg-white dark:bg-gray-900">Edit</button>
                                    <button className="px-2 py-1 text-sm rounded-md border bg-white dark:bg-gray-900 text-red-600">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: table (hidden on small screens) */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                {loading && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">Loading categories…</td>
                                    </tr>
                                )}

                                {!loading && error && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-6 text-center text-sm text-red-600">{error}</td>
                                    </tr>
                                )}

                                {!loading && !error && filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center">
                                            <div className="text-sm text-gray-500">No categories found.</div>
                                        </td>
                                    </tr>
                                )}

                                {!loading && !error && filtered.map((c) => (
                                    <tr key={c._id || c.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                        <td className="px-4 py-4 align-top">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-200 font-semibold">{(c.name || '').slice(0, 1).toUpperCase()}</div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{c.name}</div>
                                                    <div className="text-xs text-gray-500">{c._id || ''}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 align-top">
                                            <span className="inline-block px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">{c.slug}</span>
                                        </td>

                                        <td className="px-4 py-4 align-top text-sm text-gray-600 dark:text-gray-300">{truncate(c.description || '—', 120)}</td>

                                        <td className="px-4 py-4 align-top text-sm text-gray-600 dark:text-gray-300">{c.createdAt ? formatDate(c.createdAt) : '—'}</td>

                                        <td className="px-4 py-4 align-top text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <button className="px-2 py-1 text-sm rounded-md border bg-white dark:bg-gray-900">Edit</button>
                                                <button className="px-2 py-1 text-sm rounded-md border bg-white dark:bg-gray-900 text-red-600">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-3 text-sm text-gray-500">Showing {filtered.length} of {categories.length} categories</div>
            </div>
        </div>
    );
}
