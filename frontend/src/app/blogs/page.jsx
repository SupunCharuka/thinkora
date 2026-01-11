"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import Image from 'next/image';


// Blogs are fetched from the API. Keep a small fallback list for local dev if needed.
const FALLBACK_BLOGS = [];

function normalizeCategories(cat) {
	if (!cat) return [];
	if (Array.isArray(cat)) return cat;
	if (typeof cat === 'string') return [cat];
	// handle objects like { name: 'x' }
	if (typeof cat === 'object' && cat.name) return [cat.name];
	return [];
}


const truncate = (str, n = 140) => {
	if (!str) return '';
	const s = String(str).trim();
	return s.length > n ? `${s.slice(0, n - 1).trim()}…` : s;
};

const formatDate = (value) => {
	if (!value) return '';
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return String(value);
	return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const parseDateValue = (v) => {
	if (!v) return null;
	const d = new Date(v);
	return Number.isNaN(d.getTime()) ? null : d;
};

// Number of days considered "recent" when filtering
const RECENT_DAYS = 30;

const isRecent = (value, days = 7) => {
	const d = parseDateValue(value);
	if (!d) return false;
	const now = Date.now();
	const ms = days * 24 * 60 * 60 * 1000;
	return (now - d.getTime()) <= ms;
};


function BlogCard({ blog }) {


	return (
		<article className="group relative rounded-lg overflow-hidden shadow-lg cursor-pointer">
			<Link href={blog.slug ? `/blogs/${blog.slug}` : '#'} className="absolute inset-0 z-10" aria-label={blog.title} />
			<div className="block relative h-[420px] md:h-[420px] overflow-hidden bg-gray-100 rounded-lg">
				<Image src={blog.image || '/images/placeholder.svg'} alt={blog.title || 'blog image'} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
			</div>

			<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 group-hover:from-black/80"></div>

			<div className="absolute top-4 left-4">
				<span className="inline-flex items-center gap-2 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
					<span className="w-2 h-2 rounded-full bg-black inline-block" />
					{normalizeCategories(blog.category)[0] || 'Uncategorized'}
				</span>
			</div>

			{(blog.highlighted) && (
				<div className="absolute top-4 right-4">
					<div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
						<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
					</div>
				</div>
			)}

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
		</article>
	);
}

export default function blogsPage() {
	const [blogs, setBlogs] = useState(FALLBACK_BLOGS);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		async function load() {
			try {
				setLoading(true);
				const res = await fetch('/api/v1/blogs');
				if (!res.ok) throw new Error('Failed to fetch blogs');
				const data = await res.json();
				const items = Array.isArray(data) ? data : (data?.blogs || []);
				if (!mounted) return;
				// Bring highlighted blogs to the front while preserving relative order
				const sorted = [...items].sort((a, b) => {
					const ah = Boolean(a?.highlighted || a?.isHighlighted);
					const bh = Boolean(b?.highlighted || b?.isHighlighted);
					if (ah === bh) return 0;
					return ah ? -1 : 1; // highlighted first
				});
				setBlogs(sorted);
			} catch (err) {
				console.error(err);
			} finally {
				if (mounted) setLoading(false);
			}
		}
		load();
		return () => { mounted = false; };
	}, []);

	const hero = blogs.find(b => b?.highlighted || b?.isHighlighted) || blogs[0];
	const others = blogs.filter(b => b !== hero);

	// Search state (client-side, debounced)
	const [query, setQuery] = useState('');
	const [debouncedQuery, setDebouncedQuery] = useState('');

	useEffect(() => {
		const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
		return () => clearTimeout(t);
	}, [query]);

	const categories = Array.from(new Set(blogs.flatMap(p => normalizeCategories(p.category)))).sort();
	const filterOptions = ['Latest', 'Recent', ...categories];
	const primaryFilters = ['Latest', 'Recent', 'Most viewed'];
	const [primaryFilter, setPrimaryFilter] = useState(null);
	const [categoryFilter, setCategoryFilter] = useState(null);

	// reset visible count when filter or search changes
	useEffect(() => {
		setVisibleCount(STEP);
	}, [debouncedQuery, primaryFilter, categoryFilter]);

	// include all blogs so the grid shows the first blog as well; also apply search and filters
	let gridblogs = blogs.filter(p => {
		// primary Recent filter
		if (primaryFilter === 'Recent') {
			const d = parseDateValue(p.createdAt || p.date);
			if (!d || !isRecent(d, RECENT_DAYS)) return false;
		}

		// category filter
		if (categoryFilter) {
			const cats = normalizeCategories(p.category);
			if (!cats) return false;
			if (Array.isArray(cats)) {
				if (!cats.includes(categoryFilter)) return false;
			} else {
				if (String(cats) !== categoryFilter) return false;
			}
		}

		// search
		if (debouncedQuery) {
			const q = debouncedQuery.toLowerCase();
			const inTitle = (p.title || '').toLowerCase().includes(q);
			const inExcerpt = (p.excerpt || '').toLowerCase().includes(q);
			const inCategory = normalizeCategories(p.category).some(c => c.toLowerCase().includes(q));
			return inTitle || inExcerpt || inCategory;
		}
		return true;
	});

	// Sorting based on primary filter
	if (primaryFilter === 'Latest') {
		gridblogs = [...gridblogs].sort((a, b) => {
			const da = parseDateValue(a.createdAt || a.date) || new Date(0);
			const db = parseDateValue(b.createdAt || b.date) || new Date(0);
			return db - da;
		});
	} else if (primaryFilter === 'Most viewed') {
		gridblogs = [...gridblogs].sort((a, b) => (b.views || 0) - (a.views || 0));
	}

	// Pagination / page size
	const STEP = 8;
	const [visibleCount, setVisibleCount] = useState(STEP);
	const shownBlogs = gridblogs.slice(0, visibleCount);

	// Reveal-on-scroll for the blogs grid using IntersectionObserver
	const sectionRef = useRef(null);
	const [sectionVisible, setSectionVisible] = useState(false);

	useEffect(() => {
		if (!sectionRef.current) return;
		const obs = new IntersectionObserver(
			(entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						setSectionVisible(true);
						obs.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.12 }
		);

		obs.observe(sectionRef.current);
		return () => obs.disconnect();
	}, []);

	return (
		<section className="mx-auto">

			{/* Breadcrumb */}
			<nav aria-label="Breadcrumb" className="mb-4">
				<ol className="flex items-center gap-2 text-sm text-gray-600">
					<li>
						<Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900">
							<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 2.5L2 8v9a.5.5 0 00.5.5H7a.5.5 0 00.5-.5V13a1 1 0 011-1h2a1 1 0 011 1v4.5a.5.5 0 00.5.5h4.5a.5.5 0 00.5-.5V8l-8-5.5z" /></svg>
							<span>Home</span>
						</Link>
					</li>
					<li className="text-gray-300">/</li>
					<li className="font-semibold text-gray-900">Blogs</li>
				</ol>
			</nav>

			{/* Search bar (centered) */}
			<div className="mb-6 flex justify-center">
				<div className="w-full max-w-3xl relative">
					<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
						<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
					</span>
					<input
						type="search"
						value={query}
						onChange={e => setQuery(e.target.value)}
						placeholder="Search..."
						className="w-full px-12 py-3 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					{query && (
						<button
							onClick={() => setQuery('')}
							aria-label="Clear search"
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
						</button>
					)}
				</div>
			</div>

			<div className="mb-4">
				{/* Primary filters: All / Latest / Recent */}
				<div className="flex items-center gap-3 mb-3 overflow-x-auto whitespace-nowrap py-2 -mx-3 px-3">
					{primaryFilters.map(opt => {
						let count = 0;
						if (opt === 'Latest') count = blogs.length;
						else if (opt === 'Recent') count = blogs.filter(b => {
							const d = parseDateValue(b.createdAt || b.date);
							return d && isRecent(d, RECENT_DAYS);
						}).length;
						else if (opt === 'Most viewed') count = blogs.length;
						const isActive = primaryFilter === opt;
						return (
							<button
								key={opt}
								onClick={() => setPrimaryFilter(opt)}
								aria-pressed={isActive}
								className={`inline-flex flex-shrink-0 justify-center min-w-[110px] items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${isActive ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-700 border border-gray-200 hover:shadow-sm'}`}
							>
								<span className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${isActive ? 'bg-white text-blue-600' : 'bg-blue-50 text-blue-400'}`}>
									{opt === 'Latest' ? 'L' : (opt === 'Recent' ? 'R' : 'V')}
								</span>
								<span>{opt}</span>
								{/* no numeric badge for primary filters */}
							</button>
						);
					})}
				</div>

				{/* Category filters (secondary) */}
				<div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap py-2 -mx-3 px-3">
					{/** All categories chip */}
					<button
						key="all-categories"
						onClick={() => setCategoryFilter(null)}
						aria-pressed={!categoryFilter}
						className={`inline-flex flex-shrink-0 items-center gap-2 px-3 py-1 rounded-full text-sm transition-all duration-150 ${!categoryFilter ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:shadow-sm'}`}
					>
						<span className={`w-2 h-2 rounded-full ${!categoryFilter ? 'bg-white' : 'bg-blue-100'} inline-block`} />
						<span className="truncate">All</span>
						<span className={`ml-2 inline-flex items-center justify-center w-6 h-6 text-xs rounded-full ${!categoryFilter ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-600'}`}>
							{blogs.length}
						</span>
					</button>
					{categories.map(cat => {
						const normalized = normalizeCategories(cat);
						const name = Array.isArray(normalized) ? normalized.join(', ') : String(normalized || 'Uncategorized');
						const count = blogs.filter(b => normalizeCategories(b.category)?.includes(name)).length;
						const isActive = categoryFilter === name;
						return (
							<button
								key={cat}
								onClick={() => setCategoryFilter(isActive ? null : name)}
								aria-pressed={isActive}
								className={`inline-flex flex-shrink-0 items-center gap-2 px-3 py-1 rounded-full text-sm transition-all duration-150 ${isActive ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:shadow-sm'}`}
							>
								<span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-blue-100'} inline-block`} />
								<span className="truncate">{cat}</span>
								<span className={`ml-2 inline-flex items-center justify-center w-6 h-6 text-xs rounded-full ${isActive ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-600'}`}>
									{count}
								</span>
							</button>
						);
					})}
				</div>
			</div>

			<section
				ref={sectionRef}
				className={`mt-6 transform transition-all duration-700 ease-out grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
			>
				{loading ? (
					Array.from({ length: 8 }).map((_, i) => (
						<div key={`skeleton-${i}`} className="rounded-lg overflow-hidden shadow-lg bg-slate-200 h-[420px]" />
					))
				) : (
					shownBlogs.map((p, i) => {
						const key = p?._id ?? p?.id ?? p?.slug ?? `${(p?.title || 'blog')}-${i}`;
						return <BlogCard key={key} blog={p} />;
					})
				)}
			</section>

			{gridblogs.length === 0 && (
				<div className="py-16 text-center col-span-full">
					<p className="text-gray-600 mb-4 text-lg">
						No results found{debouncedQuery ? ` for "${debouncedQuery}"` : ''}.
					</p>
					<p className="text-sm text-gray-500 mb-6">Try different keywords, clear filters, or view all posts.</p>
					<div className="flex items-center justify-center gap-3">
						<button
							onClick={() => {
								setQuery('');
								setDebouncedQuery('');
								setCategoryFilter(null);
								setPrimaryFilter(null);
							}}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-800 border border-gray-200 shadow-sm hover:shadow-md"
						>
							Clear filters
						</button>
						<button
							onClick={() => { setQuery(''); setDebouncedQuery(''); setCategoryFilter(null); setPrimaryFilter('Latest'); }}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white shadow-lg hover:scale-105"
						>
							Show latest
						</button>
					</div>
				</div>
			)}

			<div className="py-6 flex flex-col items-center gap-3">
				<div className="flex items-center gap-3">
					{visibleCount > STEP && (
						<button
							onClick={() => setVisibleCount(Math.max(STEP, visibleCount - STEP))}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-800 shadow-sm hover:shadow-md"
						>
							Show less
						</button>
					)}

					{visibleCount < gridblogs.length && (
						<button
							onClick={() => setVisibleCount(Math.min(visibleCount + STEP, gridblogs.length))}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0b1220] text-white shadow-lg hover:scale-105"
						>
							See more
						</button>
					)}
				</div>
			</div>
		</section>
	);
}
