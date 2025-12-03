"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function Hero({ posts = [], autoplay = true, interval = 5000, showArrows = false, animation = 'fade', animationDuration = 600 }) {
  const slides = posts.length ? posts : [];
  const [index, setIndex] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);
  const autoplayRef = useRef(null);
  const isPaused = useRef(false);

  const visibleSlides = slides.slice(0, 4);

  useEffect(() => {
    if (!autoplay || visibleSlides.length === 0) return undefined;

    autoplayRef.current = setInterval(() => {
      if (!isPaused.current) {
        setIndex((i) => (i + 1) % Math.max(1, visibleSlides.length));
      }
    }, interval);

    return () => clearInterval(autoplayRef.current);
  }, [visibleSlides.length, autoplay, interval]);

  // no extra state needed for fade: we render all slides stacked and transition opacity

  function goPrev() {
    setIndex((i) => (i - 1 + visibleSlides.length) % visibleSlides.length);
  }

  function goNext() {
    setIndex((i) => (i + 1) % visibleSlides.length);
  }

  const current = visibleSlides[index] || {};

  // animate content when index changes: briefly reset visibility then show
  useEffect(() => {
    setContentVisible(false);
    const t = setTimeout(() => setContentVisible(true), 30);
    return () => clearTimeout(t);
  }, [index]);

  const contentStyle = {
    transition: `opacity ${animationDuration}ms ease, transform ${animationDuration}ms ease`,
    opacity: contentVisible ? 1 : 0,
    transform: contentVisible ? 'translateY(0) translateX(0)' : (animation === 'slide' ? 'translateX(20px)' : 'translateY(8px)'),
  };

  return (
    <section className="rounded-2xl overflow-hidden relative mb-6">
      <div
        onMouseEnter={() => (isPaused.current = true)}
        onMouseLeave={() => (isPaused.current = false)}
        className="md:h-[660px] w-full relative overflow-hidden"
      >
        {/* Slides layer (z-0) */}
        <div className="absolute inset-0 z-0">
          {animation === 'slide' ? (
            <div
              className="h-full flex"
              style={{
                width: `${visibleSlides.length * 100}%`,
                transform: `translate3d(-${index * (100 / Math.max(1, visibleSlides.length))}%,0,0)`,
                transition: `transform ${animationDuration}ms cubic-bezier(0.22,1,0.36,1)`,
                willChange: 'transform',
              }}
            >
              {visibleSlides.map((s, i) => (
                <div
                  key={s.slug || i}
                  className="h-full flex-none bg-cover bg-center"
                  style={{
                    width: `${100 / Math.max(1, visibleSlides.length)}%`,
                    backgroundImage: `url(${s.image || `https://picsum.photos/1600/900?random=${i + 1}`})`,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                />
              ))}
            </div>
          ) : (
            // fade: render all slides stacked and animate opacity
            <>
              {visibleSlides.map((s, i) => (
                <div
                  key={s.slug || i}
                  className="absolute inset-0 h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${s.image || `https://picsum.photos/1600/900?random=${i + 1}`})`,
                    opacity: i === index ? 1 : 0,
                    transition: `opacity ${animationDuration}ms ease`,
                  }}
                />
              ))}
            </>
          )}
        </div>

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 h-full grid grid-cols-1 md:grid-cols-4 items-center">
          <div className="md:col-span-2 pr-0 md:pr-8 text-white py-6 md:py-0" style={contentStyle}>
            <span className="inline-block bg-white/10 text-sm text-white/90 rounded-full px-3 py-1 mb-4">{current.category || 'Lifestyle'}</span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight mb-3">{current.title || 'The Future of Work: Remote, AI-Driven, and Flexible'}</h1>
            <p className="text-sm sm:text-base text-white/90 max-w-xl mb-4">{current.excerpt || 'Once dismissed as counterculture, urban fashion has moved from the sidewalks to the catwalks of major fashion capitals.'}</p>

            <div className="flex items-center gap-3 mt-4">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                <img src={current.authorImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60'} alt="author" className="h-full w-full object-cover" />
              </div>
              <div className="text-sm text-white/90">
                <div className="font-medium">{current.author || 'John Doe'}</div>
                <div className="text-xs text-white/70">{current.date || '25th July 2025'}</div>
              </div>
            </div>
          </div>

          <aside className="md:col-span-2 pl-0 md:pl-6 mt-6 md:mt-0 mb-6 md:mb-0">
            <div className="bg-white/5 backdrop-blur rounded-xl p-3 md:p-4 space-y-3 mb-6 md:mb-0">
              {visibleSlides.map((r, i) => {
                const isActive = i === index;
                return (
                  <Link
                    key={r.slug || i}
                    href={r.slug ? `/posts/${r.slug}` : '#'}
                    onMouseEnter={() => setIndex(i)}
                    onFocus={() => setIndex(i)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`flex items-center gap-3 p-2 rounded-md transition-transform transition-shadow ${isActive ? 'bg-white/10 scale-105 shadow-lg' : 'hover:bg-white/5'}`}
                  >
                    <div className={`h-12 w-12 md:h-16 md:w-16 rounded-md overflow-hidden flex-shrink-0 bg-slate-400 ${isActive ? 'ring-2 ring-white/30' : ''}`}>
                      <img src={r.image || `https://picsum.photos/200/160?random=${i + 2}`} alt="thumb" className="h-full w-full object-cover" />
                    </div>
                    <div className="text-white">
                      <div className="font-semibold text-sm md:text-base">{r.title}</div>
                      <div className="text-xs text-white/70">{r.date}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>

        {/* Prev / Next controls (render only if showArrows is true) */}
        {showArrows && (
          <>
            <button onClick={goPrev} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white rounded-full p-2">
              ‹
            </button>
            <button onClick={goNext} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white rounded-full p-2">
              ›
            </button>
          </>
        )}

        {/* Indicators */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {visibleSlides.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} aria-label={`Go to slide ${i + 1}`} className={`h-3 w-3 rounded-full ${i === index ? 'bg-white/90' : 'bg-white/40'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
