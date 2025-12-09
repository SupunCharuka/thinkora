"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={`py-6 transition-all duration-300 ${scrolled ? 'sticky top-0 z-40 py-2' : ''}`}>
      <div className="max-w-7xl mx-auto container px-4">
        <div className={`relative px-4 md:px-6 py-3 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-white/60 backdrop-blur-sm shadow-sm rounded-xl' : 'bg-gradient-to-r from-white via-slate-50 to-white rounded-2xl shadow-md'}`}>
          {/* Left: Logo (creative) */}
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#E07A4D] via-[#F2C57C] to-[#2E8F56] bg-clip-text text-transparent">BLOG</span>
              <span className="text-xs text-gray-400 ml-1">— thoughts</span>
            </div>
          </Link>

          {/* Center: Navigation (hidden on small screens) */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
            {[
              { href: '/', label: 'Home' },
              { href: '/blogs', label: 'Blogs' },
              { href: '/collections', label: 'Collections' },
              { href: '/trending', label: 'Trending' },
            ].map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative px-2 py-1 rounded-md transition-all ${isActive ? 'text-black font-semibold' : 'text-gray-700 hover:text-black hover:scale-105'}`}
                >
                  <span className="font-medium">{item.label}</span>
                  <span className={`absolute left-0 right-0 -bottom-2 h-0.5 bg-gradient-to-r from-[#E07A4D] to-[#2E8F56] transition-opacity duration-200 rounded ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                </Link>
              );
            })}
          </nav>

          {/* Right: Search, theme, menu */}
          <div className="flex items-center gap-3">
            {/* Desktop auth links */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="text-sm text-gray-700 hover:text-black">Sign in</Link>
              <Link href="/signup" className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">Sign up</Link>
            </div>

            <button aria-label="Toggle theme" className="p-2 rounded-md text-gray-600 hover:bg-gray-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            </button>

            <button
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(open => !open)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-50"
            >
              <svg className={`w-6 h-6 transition-transform ${menuOpen ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile menu panel */}
          {menuOpen && (
            <div className="md:hidden absolute left-4 right-4 top-full mt-3 z-50">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg ring-1 ring-black/5 overflow-hidden">
                <nav className="flex flex-col p-4 gap-2 text-sm">
                  {[
                    { href: '/', label: 'Home' },
                    { href: '/blogs', label: 'Blogs' },
                    { href: '/collections', label: 'Collections' },
                    { href: '/trending', label: 'Trending' },
                  ].map((item) => {
                    const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
                    if (item.href === '/trending') {
                      return (
                        <Link key={item.href} href={item.href} className={`px-3 py-2 rounded hover:bg-gray-50 flex items-center justify-between ${isActive ? 'bg-white/50' : ''}`} onClick={() => setMenuOpen(false)} aria-current={isActive ? 'page' : undefined}>
                          <span>{item.label}</span>
                          <span className="inline-flex items-center bg-green-50 text-green-600 rounded-full px-2 py-0.5 text-xs font-medium">Hot</span>
                        </Link>
                      );
                    }
                    return (
                      <Link key={item.href} href={item.href} className={`px-3 py-2 rounded hover:bg-gray-50 ${isActive ? 'bg-white/50 font-semibold' : ''}`} onClick={() => setMenuOpen(false)} aria-current={isActive ? 'page' : undefined}>
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="border-t border-gray-100 mt-2 pt-3 px-3">
                  <Link href="/login" className="block px-3 py-2 rounded hover:bg-gray-50">Sign in</Link>
                  <Link href="/signup" className="mt-2 inline-block w-full text-center px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">Sign up</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
