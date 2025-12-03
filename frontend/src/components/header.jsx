"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

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
      <div className="mx-auto container px-4">
        <div className={`relative px-6 py-3 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-white/60 backdrop-blur-sm shadow-sm rounded-xl' : 'bg-white rounded-2xl shadow-md'}`}>
          {/* Left: Logo */}
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-[#E07A4D]">BL</span>
              <span className="text-[#2E8F56]">OG</span>
              <span className="text-[#2E8F56]">.</span>
            </span>
          </Link>

          {/* Center: Navigation (hidden on small screens) */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-700">
            <div className="flex items-center gap-2 group">
              <Link href="/" className="hover:text-black">Home</Link>
              <svg className="w-3 h-3 text-gray-400 group-hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>

            <div className="flex items-center gap-2 group">
              <Link href="/features" className="hover:text-black">Features</Link>
              <svg className="w-3 h-3 text-gray-400 group-hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>

            <div className="flex items-center gap-2 group">
              <Link href="/collections" className="hover:text-black">Collections</Link>
              <svg className="w-3 h-3 text-gray-400 group-hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/trending" className="hover:text-black flex items-center gap-2">
                <span>Trending</span>
                <span className="inline-flex items-center bg-green-50 text-green-600 rounded-full px-2 py-0.5 text-xs font-medium">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M13 2L3 14h9l-1 8L21 10h-9l1-8z" />
                  </svg>
                </span>
              </Link>
            </div>
          </nav>

          {/* Right: Icons */}
          <div className="flex items-center gap-4">
            <button aria-label="Search" className="p-2 rounded-md text-gray-600 hover:bg-gray-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="6" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

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
                  <Link href="/" className="px-3 py-2 rounded hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Home</Link>
                  <Link href="/features" className="px-3 py-2 rounded hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Features</Link>
                  <Link href="/collections" className="px-3 py-2 rounded hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Collections</Link>
                  <Link href="/trending" className="px-3 py-2 rounded hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                    <div className="flex items-center justify-between">
                      <span>Trending</span>
                      <span className="inline-flex items-center bg-green-50 text-green-600 rounded-full px-2 py-0.5 text-xs font-medium">Hot</span>
                    </div>
                  </Link>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
