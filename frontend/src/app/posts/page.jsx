"use client";

import React, {useState} from "react";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const posts = [
	{
		id: 1,
		title: 'Beachmaster Elephant Seal Fights off Rival Male, The match is uncompromising',
		category: ['Travel','Animal'],
		date: '20 minutes ago',
		read: '23k Views',
		image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
		excerpt: 'A short excerpt for the hero post to give readers a preview.'
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



function PostCard({post, variant = 'large'}){
	const router = useRouter();
	const [favorited, setFavorited] = useState(false);

	function goToPost(){
		router.push(`/posts/${post.id}`);
	}

	function toggleFavorite(e){
		// prevent triggering navigation when clicking the ribbon
		e.stopPropagation();
		setFavorited(v => !v);
	}
	if(variant === 'compact'){
		return (
			<article className="group flex gap-3 items-start bg-white rounded-lg p-3 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
				<Link href={`/posts/${post.id}`} className="relative w-36 h-24 rounded overflow-hidden flex-shrink-0">
					<Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
				</Link>
				<div>
					<div className="text-xs text-amber-500 font-bold mb-1">{post.category?.[0]}</div>
					<h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">{post.title}</h3>
					<div className="text-sm text-gray-500 mt-2">{post.date} · {post.read}</div>
				</div>
			</article>
		);
	}

	return (
		<article onClick={goToPost} onKeyDown={(e)=>{ if(e.key==='Enter') goToPost(); }} role="button" tabIndex={0} className="group relative rounded-lg overflow-hidden shadow-lg cursor-pointer">
			<div className="block relative h-[420px] md:h-[420px] overflow-hidden">
				<Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
			</div>
			<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 group-hover:from-black/80"></div>

			<div className="absolute top-4 left-4">
				<span className="inline-flex items-center gap-2 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
					<span className="w-2 h-2 rounded-full bg-black inline-block" />
					{post.category?.[0]}
				</span>
			</div>

			<div className="absolute top-0 right-0">
				<div className="relative">
					<button onClick={toggleFavorite} aria-pressed={favorited} className="w-12 h-12 bg-blue-600 rounded-bl-lg transform rotate-0 translate-x-3 -translate-y-3 shadow-md flex items-center justify-center focus:outline-none" title={favorited ? 'Unfavorite' : 'Add to favorites'}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-4 h-4 text-white -rotate-45 ${favorited ? 'opacity-100' : 'opacity-90'}`} fill="currentColor"><path d="M12 .587l3.668 7.431L24 9.748l-6 5.854L19.335 24 12 19.771 4.665 24 6 15.602 0 9.748l8.332-1.73z"/></svg>
					</button>
				</div>
			</div>

			<div className="absolute left-5 bottom-5 right-5 text-white">
				<h3 className="text-lg md:text-2xl font-bold leading-tight mb-2 transition-transform duration-300 group-hover:-translate-y-1">{post.title}</h3>
				<div className="text-sm text-white/80">by Author · {post.date}</div>
				{post.excerpt && (
					<p className="mt-2 text-sm text-white/90 max-w-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">{post.excerpt}</p>
				)}
			</div>
		</article>
	);
}

export default function PostsPage(){
	const hero = posts[0];
	const others = posts.slice(1);

	const categories = Array.from(new Set(posts.flatMap(p => p.category || []))).sort();
	const filterOptions = ['All post', ...categories];
	const [activeFilter, setActiveFilter] = useState('All post');

	const gridPosts = others.slice(2).filter(p => {
		if (activeFilter === 'All post') return true;
		return p.category?.includes(activeFilter);
	});

	return (
		<main className="px-6 py-8 max-w-[1200px] mx-auto">

			<div className="mb-6 flex items-center gap-4">
				<div className="text-sm text-gray-500">Show me:</div>
				<div className="flex items-center gap-3">
					{filterOptions.map(opt => (
						<button key={opt} onClick={() => setActiveFilter(opt)} className={`px-3 py-1 rounded-full text-sm ${activeFilter===opt ? 'bg-blue-600 text-white' : 'text-gray-600 bg-white border border-transparent hover:bg-gray-50'}`}>
							{opt}
						</button>
					))}
				</div>
			</div>

			<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
				{gridPosts.map(p => (
					<PostCard key={p.id} post={p} />
				))}
			</section>

			<footer className="flex justify-center py-9">
				<div className="flex items-center gap-3">
					<button className="w-9 h-9 rounded-full border border-gray-200 bg-white">←</button>
					<button className="w-9 h-9 rounded-full bg-blue-600 text-white">01</button>
					<button className="w-9 h-9 rounded-full border border-gray-200 bg-white">02</button>
					<button className="w-9 h-9 rounded-full border border-gray-200 bg-white">03</button>
					<button className="w-9 h-9 rounded-full border border-gray-200 bg-white">→</button>
				</div>
			</footer>
		</main>
	);
}
