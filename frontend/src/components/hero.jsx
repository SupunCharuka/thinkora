import React from 'react';
import Link from 'next/link';

export default function Hero({ posts = [] }) {
  const featured = posts[0] || {};
  const related = posts.slice(1, 4);

  return (
    <section className="rounded-2xl overflow-hidden relative mb-6">
      <div
        className=" md:h-[660px] w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1800&q=60')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 h-full grid grid-cols-1 md:grid-cols-3 items-center">
          <div className="md:col-span-2 pr-0 md:pr-8 text-white py-6 md:py-0">
            <span className="inline-block bg-white/10 text-sm text-white/90 rounded-full px-3 py-1 mb-4">Lifestyle</span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight mb-3">{featured.title || 'The Future of Work: Remote, AI-Driven, and Flexible'}</h1>
            <p className="text-sm sm:text-base text-white/90 max-w-xl mb-4">{featured.excerpt || 'Once dismissed as counterculture, urban fashion has moved from the sidewalks to the catwalks of major fashion capitals.'}</p>

            <div className="flex items-center gap-3 mt-4">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60" alt="author" className="h-full w-full object-cover" />
              </div>
              <div className="text-sm text-white/90">
                <div className="font-medium">John Doe</div>
                <div className="text-xs text-white/70">25th July 2025</div>
              </div>
            </div>
          </div>

          <aside className="md:col-span-1 pl-0 md:pl-6 mt-6 md:mt-0 mb-6 md:mb-0">
            <div className="bg-white/5 backdrop-blur rounded-xl p-3 md:p-4 space-y-3 mb-6 md:mb-0">
              {related.map((r) => (
                <Link key={r.slug} href={`/posts/${r.slug}`} className="flex items-center gap-3">
                  <div className="h-12 w-12 md:h-16 md:w-16 rounded-md overflow-hidden flex-shrink-0 bg-slate-400">
                    <img src={`https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=200&q=60`} alt="thumb" className="h-full w-full object-cover" />
                  </div>
                  <div className="text-white">
                    <div className="font-semibold text-sm md:text-base">{r.title}</div>
                    <div className="text-xs text-white/70">{r.date}</div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>

        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          <span className="h-3 w-3 rounded-full bg-white/90" />
          <span className="h-3 w-3 rounded-full bg-white/40" />
          <span className="h-3 w-3 rounded-full bg-white/40" />
          <span className="h-3 w-3 rounded-full bg-white/40" />
        </div>
      </div>
    </section>
  );
}
