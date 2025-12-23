"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero({ blogs = [], autoplay = true, interval = 5000, showArrows = false, animation = 'fade', animationDuration = 600 }) {
  const [localBlogs, setLocalBlogs] = useState(blogs && blogs.length ? blogs : []);
  const [loading, setLoading] = useState(!(blogs && blogs.length));
  const slides = localBlogs.length ? localBlogs : [];
  const [index, setIndex] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);
  const autoplayRef = useRef(null);
  const isPaused = useRef(false);

  const [clampLines, setClampLines] = useState(3);

  const visibleSlides = slides.slice(0, 4);

  useEffect(() => {
    const updateClamp = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
      if (w < 480) setClampLines(2);
      else if (w < 640) setClampLines(3);
      else setClampLines(4);
    };

    updateClamp();
    window.addEventListener('resize', updateClamp);
    return () => window.removeEventListener('resize', updateClamp);
  }, []);

  useEffect(() => {
    if (blogs && blogs.length) {
      setLocalBlogs(blogs);
      setLoading(false);
      return;
    }

    let canceled = false;
    const base = process.env.NEXT_PUBLIC_API_URL;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${base}/api/v1/blogs?hero=true&limit=4`);
        if (res.ok) {
          const data = await res.json();
          if (!canceled) setLocalBlogs(data);
        }
      } catch (err) {
        console.error('Failed to fetch hero blogs', err);
      } finally {
        if (!canceled) setLoading(false);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [blogs]);

  // ensure each visible slide has a stable image and thumbnail URL
  const slidesWithImages = visibleSlides.map((s) => {
    const envBase = (process?.env?.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

    const normalize = (src) => {
      if (!src) return null;
      if (/^https?:\/\//i.test(src)) {
        try {
          const u = new URL(src);
          // If source starts with configured API base, convert to same-origin path
          if (envBase && src.startsWith(envBase)) return src.replace(envBase, '') || '/';
          return src;
        } catch (e) {
          return src;
        }
      }
      // relative path (uploads or other) — make it absolute on this origin so Next can handle it
      if (src.startsWith('/')) return src;
      if (envBase) return `${envBase}/${src}`;
      return `/${src}`;
    };

    const image = normalize(s.image) || '/images/placeholder.svg';
    const thumb = normalize(s.imageThumb || s.image) || '/images/placeholder.svg';

    // Map backend populated fields to simple display-friendly props
    const categoryName = s.category && typeof s.category === 'object' ? (s.category.name || s.category.slug) : (s.category || 'Lifestyle');
    const date = s.createdAt ? new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : (s.date || null);

    return { ...s, __image: image, __thumb: thumb, category: categoryName, date };
  });

  useEffect(() => {
    if (!autoplay || visibleSlides.length === 0) return undefined;

    autoplayRef.current = setInterval(() => {
      if (!isPaused.current) {
        setIndex((i) => (i + 1) % Math.max(1, visibleSlides.length));
      }
    }, interval);

    return () => clearInterval(autoplayRef.current);
  }, [visibleSlides.length, autoplay, interval]);

  // animate content when index changes: briefly reset visibility then show
  useEffect(() => {
    setContentVisible(false);
    const t = setTimeout(() => setContentVisible(true), 30);
    return () => clearTimeout(t);
  }, [index]);


  const current = slidesWithImages[index] || {};

  if (loading && slides.length === 0) {
    return (
      <div className="animate-pulse py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="col-span-1 lg:col-span-2 h-64 bg-slate-200 rounded-lg" />
          <div className="hidden lg:block h-64 bg-slate-200 rounded-lg" />
          <div className="hidden lg:block h-64 bg-slate-200 rounded-lg" />
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="h-36 bg-slate-200 rounded-md" />
          <div className="h-36 bg-slate-200 rounded-md" />
          <div className="h-36 bg-slate-200 rounded-md" />
          <div className="h-36 bg-slate-200 rounded-md" />
        </div>
      </div>
    );
  }


  const contentStyle = {
    transition: `opacity ${animationDuration}ms ease, transform ${animationDuration}ms ease`,
    opacity: contentVisible ? 1 : 0,
    transform: contentVisible ? 'translateY(0) translateX(0)' : (animation === 'slide' ? 'translateX(20px)' : 'translateY(8px)'),
  };

  return (
    <section className="rounded-2xl overflow-hidden relative mb-6" role="region" aria-label="Hero section">
      <div
        onMouseEnter={() => (isPaused.current = true)}
        onMouseLeave={() => (isPaused.current = false)}
        className="h-64 md:h-[660px] w-full relative overflow-hidden"
      >
        {/* Slides layer (z-0) */}
        <div className="absolute inset-0 z-0">
          {animation === 'slide' ? (
            <div
              className="h-full flex"
              style={{
                width: `${slidesWithImages.length * 100}%`,
                transform: `translate3d(-${index * (100 / Math.max(1, slidesWithImages.length))}%,0,0)`,
                transition: `transform ${animationDuration}ms cubic-bezier(0.22,1,0.36,1)`,
                willChange: 'transform',
              }}
            >
              {slidesWithImages.map((s, i) => (
                <div
                  key={s.slug || i}
                  className="h-full flex-none relative"
                  style={{
                    width: `${100 / Math.max(1, slidesWithImages.length)}%`,
                  }}
                >
                  <Image
                    src={s.__image}
                    alt={s.title}
                    fill
                    loading={i === index ? 'eager' : 'lazy'}
                    priority={i === index}
                    className="object-cover object-center"
                  />
                </div>
              ))}
            </div>
          ) : (
            // fade: render all slides stacked and animate opacity
            <>
              {slidesWithImages.map((s, i) => (
                <div
                  key={s.slug || i}
                  className="absolute inset-0 h-full"
                  style={{
                    opacity: i === index ? 1 : 0,
                    transition: `opacity ${animationDuration}ms ease`,
                  }}
                >
                  <Image
                    src={s.__image}
                    alt={s.title}
                    fill
                    loading={i === index ? 'eager' : 'lazy'}
                    priority={i === index}
                    className="object-cover object-center"
                  />
                </div>
              ))}
            </>
          )}
        </div>

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 h-full grid grid-cols-1 md:grid-cols-4 items-center">
          <div className="md:col-span-2 pr-0 md:pr-8 text-white py-6 md:py-0" style={contentStyle}>
            <span className="inline-block bg-white/10 text-sm text-white/90 rounded-full px-3 py-1 mb-4">{current.category || 'Lifestyle'}</span>
            <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold leading-tight mb-3">{current.title || 'The Future of Work: Remote, AI-Driven, and Flexible'}</h1>
            <p
              className="text-sm sm:text-base text-white/90 max-w-xl mb-4 overflow-hidden"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: clampLines,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {current.excerpt || 'Once dismissed as counterculture, urban fashion has moved from the sidewalks to the catwalks of major fashion capitals.'}
            </p>

            <div className="mt-4">
              <div className="text-sm text-white/90">
                <div className="text-xs text-white/70">{current.date}</div>
              </div>
            </div>
          </div>

          <aside className="hidden md:block md:col-span-2 pl-0 md:pl-6 mt-6 md:mt-0 mb-6 md:mb-0">
            <div className="bg-white/5 backdrop-blur rounded-xl p-3 md:p-4 space-y-3 mb-6 md:mb-0">
              {slidesWithImages.map((r, i) => {
                const isActive = i === index;
                return (
                  <Link
                    key={r.slug || i}
                    href={r.slug ? `/blogs/${r.slug}` : '#'}
                    onMouseEnter={() => setIndex(i)}
                    onFocus={() => setIndex(i)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`flex items-center gap-3 p-2 rounded-md transition-transform transition-shadow ${isActive ? 'bg-white/10 scale-105 shadow-lg' : 'hover:bg-white/5'}`}
                  >
                    <div className={`h-12 w-12 md:h-16 md:w-16 rounded-md overflow-hidden flex-shrink-0 bg-slate-400 ${isActive ? 'ring-2 ring-white/30' : ''}`}>
                      <Image
                        src={r.__thumb || r.__image}
                        alt="thumb"
                        width={64}
                        height={64}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="text-white">
                      <div className="font-semibold text-sm md:text-base">{r.title}</div>
                      {/* <div className="text-xs text-white/70">{r.date}</div> */}
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
