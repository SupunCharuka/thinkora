"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import Image from 'next/image';


const blogs = [
	{
		id: 1,
		title: 'Beachmaster Elephant Seal Fights off Rival Male, The match is uncompromising',
		category: ['Travel'],
		date: '20 minutes ago',
		read: '23k Views',
		image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
	},
	{
		id: 2,
		title: 'Put Yourself in Your Customers Shoes',
		category: ['Fashion'],
		date: '17 JULY',
		read: '12k Views',
		image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'
	},
	{
		id: 3,
		title: 'Life and Death in the Empire of the Tiger',
		category: ['Travel'],
		date: '7 AUGUST',
		read: '500 Views',
		image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80'
	},
	{
		id: 4,
		title: 'When Two Wheels Are Better Than Four',
		category: ['Lifestyle'],
		date: '15 JUN',
		read: '1.2k Views',
		image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
	},
	{
		id: 5,
		title: 'The Life of a Travel Writer with David Farley',
		category: ['Fashion'],
		date: '17 JULY',
		read: '12k Views',
		image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
	},
	{
		id: 6,
		title: 'The 22 Best Things to See and Do in Bangkok',
		category: ['Travel'],
		date: '7 AUGUST',
		read: '500 Views',
		image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80'
	},
	{
		id: 7,
		title: "Why Don't More Black American Women Travel Solo?",
		category: ['Lifestyle'],
		date: '15 JUN',
		read: '1.2k Views',
		image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80'
	},
	{
		id: 8,
		title: 'My 8 Favorite Hostels in San José, Costa Rica',
		category: ['Fashion'],
		date: '17 JULY',
		read: '12k Views',
		image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80'
	},

];



function BlogCard({ blog }) {

	return (
		<article className="group relative rounded-lg overflow-hidden shadow-lg cursor-pointer">
			<Link href={`/blogs/${blog.id}`} className="absolute inset-0 z-10" aria-label={blog.title} />
			<div className="block relative h-[420px] md:h-[420px] overflow-hidden bg-gray-100 rounded-lg">
				<Image src={blog.image} alt={blog.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
			</div>
			<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 group-hover:from-black/80"></div>

			<div className="absolute top-4 left-4">
				<span className="inline-flex items-center gap-2 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
					<span className="w-2 h-2 rounded-full bg-black inline-block" />
					{blog.category?.[0]}
				</span>
			</div>

			<div className="absolute top-4 right-4">
				<div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
					<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
				</div>
			</div>

			<div className="absolute left-5 bottom-5 right-5 text-white">
				<h3 className="text-white text-2xl sm:text-xl font-bold leading-tight drop-shadow-lg mb-2 transition-all duration-300 group-hover:-translate-y-1">
					<span className="inline-block">{blog.title}</span>
					<span className="block h-[2px] bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-2" aria-hidden="true" />
				</h3>
				<div className="text-sm text-white/80">by Author · {blog.date}</div>
				{blog.excerpt && (
					<p className="mt-2 text-sm text-white/90 max-w-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">{blog.excerpt}</p>
				)}
			</div>
		</article>
	);
}

export default function blogsPage() {
	const hero = blogs[0];
	const others = blogs.slice(1);

	const categories = Array.from(new Set(blogs.flatMap(p => p.category || []))).sort();
	const filterOptions = ['All blog', ...categories];
	const [activeFilter, setActiveFilter] = useState('All blog');

	// include all blogs so the grid shows the first blog as well
	const gridblogs = blogs.filter(p => {
		if (activeFilter === 'All blog') return true;
		return p.category?.includes(activeFilter);
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

			<div className="mb-6 flex items-center gap-4">
				<div className="text-sm text-gray-500">Show me:</div>
				<div className="flex flex-wrap items-center gap-3">
					{filterOptions.map(opt => {
						const count = opt === 'All blog' ? blogs.length : blogs.filter(p => p.category?.includes(opt)).length;
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
				{gridblogs.map(p => (
					<BlogCard key={p.id} blog={p} />
				))}
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
