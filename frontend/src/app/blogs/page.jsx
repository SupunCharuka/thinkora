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

			<div className="absolute top-4 right-4">
				<div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
					<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
				</div>
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
				setBlogs(items);
			} catch (err) {
				console.error(err);
			} finally {
				if (mounted) setLoading(false);
			}
		}
		load();
		return () => { mounted = false; };
	}, []);

	const hero = blogs[0];
	const others = blogs.slice(1);

	const categories = Array.from(new Set(blogs.flatMap(p => normalizeCategories(p.category)))).sort();
	const filterOptions = ['All blog', ...categories];
	const [activeFilter, setActiveFilter] = useState('All blog');

	// include all blogs so the grid shows the first blog as well
	const gridblogs = blogs.filter(p => {
		if (activeFilter === 'All blog') return true;
		return normalizeCategories(p.category).includes(activeFilter);
	});

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
		<main className="mx-auto">

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

			<div className="mb-6 flex items-center gap-4">
				<div className="text-sm text-gray-500">Show me:</div>
				<div className="flex flex-wrap items-center gap-3">
					{filterOptions.map(opt => {
						const count = opt === 'All blog' ? blogs.length : blogs.filter(p => normalizeCategories(p.category).includes(opt)).length;
						const isActive = activeFilter === opt;
						return (
							<button
								key={opt}
								onClick={() => setActiveFilter(opt)}
								aria-pressed={isActive}
								className={`group inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-all duration-150 ${isActive ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:shadow-sm'}`}
							>
								<span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-blue-100'} inline-block`} />
								<span className="truncate">{opt}</span>
								<span className={`ml-2 inline-flex items-center justify-center w-6 h-6 text-xs rounded-full ${isActive ? 'bg-white text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
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
				{gridblogs.map((p, i) => {
					const key = p?._id ?? p?.id ?? p?.slug ?? `${(p?.title || 'blog')}-${i}`;
					return <BlogCard key={key} blog={p} />;
				})}
			</section>

			<div className="py-6 flex justify-center">
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
		</main>
	);
}
