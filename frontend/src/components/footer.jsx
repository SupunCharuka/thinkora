"use client";

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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-3xl font-extrabold tracking-tight">
                <span className="text-amber-500">B</span>
                <span className="text-emerald-600">L</span>
                <span className="text-slate-700">OG</span>
                <span className="text-emerald-600">.</span>
              </h3>
              <span className="text-sm text-gray-500">The colors of life.</span>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Blending tech, life, and business. Stay informed with fresh trends,
              smart insights, and expert takes across every topic that matters.
            </p>

            <div className="inline-flex items-center gap-3 bg-white p-2 rounded-full shadow-sm">
              <button aria-label="facebook" className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">f</button>
              <div className="w-px h-6 bg-gray-200" />
              <button aria-label="x" className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">X</button>
              <div className="w-px h-6 bg-gray-200" />
              <button aria-label="linkedin" className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">in</button>
              <div className="w-px h-6 bg-gray-200" />
              <button aria-label="behance" className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">Bé</button>
            </div>
          </div>

          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-4 text-gray-800">Hot topics</h4>
              <ul className="space-y-3 text-gray-500">
                <li>Lifestyle</li>
                <li>Business</li>
                <li>Science</li>
                <li>Technology</li>
                <li>Gaming</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-800">Trending</h4>
              <ul className="space-y-3 text-gray-500">
                <li>Culture</li>
                <li>Become an author</li>
                <li>Education</li>
                <li>Environment</li>
                <li>Beauty</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-800">Find Out More</h4>
              <div className="space-y-4">
                {[1, 2].map((id) => (
                  <a
                    key={id}
                    href="#"
                    className="flex items-center gap-3 bg-white p-2 rounded-md shadow-sm"
                  >
                    <img
                      src={`https://images.unsplash.com/photo-1762770640764-bfb05d380670?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
                      alt={`thumb-${id}`}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="text-sm">
                      <div className="font-semibold text-gray-800">The Rise of Mindful Living in a Digital World</div>
                      <div className="text-xs text-gray-400 mt-1">16 Jul, 2025 • 6 mins read</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <div>© {year} <span className="font-semibold text-gray-700">BLOG</span>. All Rights Reserved</div>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Term of Use</a>
            <a href="#" className="hover:underline">Advertise</a>
          </div>
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
