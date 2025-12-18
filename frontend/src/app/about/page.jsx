"use client";
import Link from "next/link";
import React from "react";
import useDashboardAuth from '@/hooks/useDashboardAuth';


export default function About() {
	const { data, loading } = useDashboardAuth({ redirect: false });

	return (
		<main className="relative min-h-screen  text-slate-900 py-20 overflow-hidden">
			{/* decorative blobs */}
			<div className="pointer-events-none absolute inset-0 -z-10">
				<svg className="absolute left-[-10%] top-0 w-80 opacity-30 animate-blob" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
					<g transform="translate(300,300)">
						<path d="M120,-170C152,-127,161,-76,174,-22C187,31,204,87,184,128C163,168,106,193,47,205C-12,217,-75,216,-114,186C-153,156,-168,97,-186,39C-203,-19,-224,-76,-211,-125C-199,-174,-153,-214,-99,-236C-44,-258,16,-262,74,-248C132,-233,88,-213,120,-170Z" fill="#A78BFA" />
					</g>
				</svg>
				<svg className="absolute right-[-5%] bottom-0 w-96 opacity-20 animate-blob animation-delay-2000" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
					<g transform="translate(300,300)">
						<path d="M82,-122C106,-86,117,-48,136,-3C154,42,179,84,168,124C157,164,111,202,61,218C11,234,-42,228,-87,201C-131,174,-168,126,-186,72C-204,19,-202,-41,-178,-84C-154,-126,-109,-150,-64,-166C-19,-182,26,-190,68,-177C110,-163,58,-158,82,-122Z" fill="#60A5FA" />
					</g>
				</svg>
			</div>

			<section className="container mx-auto px-6 lg:px-8">
				<div className="grid gap-12 lg:grid-cols-2 items-center">
					<div className="max-w-xl">
						<h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
							We tell stories that stick
						</h1>
						<p className="text-lg text-slate-600 mb-6">Beautifully written, carefully edited, and thoughtfully designed content for readers and creators a like.</p>

						<div className="flex flex-wrap gap-3 mb-6">
								<Link
									href={data ? '/dashboard' : '/signup'}
									className="inline-flex items-center gap-3 bg-[#0b1220] text-white px-5 py-3 rounded-full shadow-lg hover:scale-105 transform transition"
								>
									{loading ? 'Loading…' : 'Get started'}
								</Link>
							<Link href="/blogs" className="inline-flex items-center gap-3 border border-slate-200 px-4 py-3 rounded-full hover:bg-slate-50 transition">Explore blogs</Link>
						</div>

						<div className="flex gap-4">
							<div className="p-4 bg-white/60 backdrop-blur rounded-2xl shadow-md">
								<div className="text-2xl font-bold">150K+</div>
								<div className="text-sm text-slate-600">Monthly readers</div>
							</div>
							<div className="p-4 bg-white/60 backdrop-blur rounded-2xl shadow-md">
								<div className="text-2xl font-bold">1.2K+</div>
								<div className="text-sm text-slate-600">Published posts</div>
							</div>
						</div>
					</div>

					<div className="relative">
						<div className="rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition">
							<svg viewBox="0 0 560 360" className="w-full h-auto block bg-white">
								<defs>
									<linearGradient id="g1" x1="0" x2="1">
										<stop offset="0%" stopColor="#7c3aed" />
										<stop offset="100%" stopColor="#06b6d4" />
									</linearGradient>
								</defs>
								<rect width="560" height="360" fill="url(#g1)" />
								<g transform="translate(40,40)" fill="white" opacity="0.9">
									<rect x="0" y="0" width="120" height="18" rx="6"/>
									<rect x="0" y="36" width="480" height="12" rx="6"/>
									<rect x="0" y="64" width="320" height="12" rx="6"/>
									<rect x="0" y="92" width="420" height="12" rx="6"/>
								</g>
							</svg>
						</div>

					</div>
				</div>

				<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{[
						{title: 'Readers', value: '150K+'},
						{title: 'Posts', value: '1.2K+'},
						{title: 'Contributors', value: '300+'},
						{title: 'Years', value: '10'}
					].map((s) => (
						<div key={s.title} className="relative p-6 rounded-3xl bg-gradient-to-br from-white/60 to-white/30 shadow-lg backdrop-blur-md border border-white/30 hover:scale-105 transform transition">
							<div className="text-3xl font-extrabold mb-1">{s.value}</div>
							<div className="text-sm text-slate-600">{s.title}</div>
						</div>
					))}
				</div>

				<section className="mt-16 max-w-4xl mx-auto">
					<h2 className="text-3xl font-bold text-center mb-8">Vision & Mission</h2>
					<div className="grid gap-6 sm:grid-cols-2">
						<div className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition">
							<div className="text-xl font-semibold mb-2">Our Vision</div>
							<p className="text-slate-600">To be the home for thoughtful, lasting stories that inspire and inform readers worldwide. We imagine a platform where quality writing rises above noise.</p>
						</div>
						<div className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition">
							<div className="text-xl font-semibold mb-2">Our Mission</div>
							<p className="text-slate-600">Empower creators with editorial support, elegant design, and a welcoming community so they can publish work that matters and reach engaged audiences.</p>
						</div>
					</div>
				</section>

				<section className="mt-16 max-w-3xl mx-auto text-center">
					<h3 className="text-2xl font-bold mb-4">Collaborate with us</h3>
					<p className="text-slate-600 mb-6">Sponsorships, guest posts, and partnerships — we'd love to hear from you.</p>
					<Link href="/contact" className="inline-block bg-transparent border border-[#0b1220] text-[#0b1220] px-6 py-3 rounded-full hover:bg-indigo-50 transition">Get in touch</Link>
				</section>
			</section>
		</main>
	);
}
