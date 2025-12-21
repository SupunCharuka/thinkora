"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
        <div>© {year} <span className="font-semibold text-gray-700">THINKORA</span>. All Rights Reserved</div>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms-of-use" className="hover:underline">Term of Use</Link>
        
        </div>
      </div>

      <button
        onClick={scrollToTop}
        aria-label="scroll to top"
        className={`fixed right-6 bottom-6 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-lg transform transition-opacity duration-200 ${showTop ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        ↑
      </button>
    </footer>
  );
}
