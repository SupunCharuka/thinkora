"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Topbar({ onOpenSidebar, greeting: propGreeting, subtitle: propSubtitle }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [greeting, setGreeting] = useState(propGreeting || 'Dashboard');
  const [subtitle, setSubtitle] = useState(propSubtitle || 'Realtime overview');

  useEffect(() => {
    if (propGreeting) setGreeting(propGreeting);
    if (propSubtitle) setSubtitle(propSubtitle);

    try {
      const stored = localStorage.getItem('dashboardGreeting');
      if (stored && !propGreeting) setGreeting(stored);
    } catch (e) {}

    const handler = (e) => {
      const d = e && e.detail ? e.detail : null;
      if (!d) return;
      if (d.greeting) setGreeting(d.greeting);
      if (d.subtitle) setSubtitle(d.subtitle);
    };

    window.addEventListener('dashboardGreeting', handler);
    return () => window.removeEventListener('dashboardGreeting', handler);
  }, [propGreeting, propSubtitle]);

  function doSignOut() {
    (async () => {
      try {
        // Call our frontend logout proxy which clears the HttpOnly token cookie
        const token = (typeof window !== 'undefined' && localStorage.getItem('token')) || null;
        await fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include', headers: token ? { Authorization: `Bearer ${token}` } : {} });
      } catch (e) {
        // ignore network errors
      }

      try {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('authChange'));
      } catch (e) {
        // ignore
      }

      setConfirmOpen(false);
      router.push('/');
    })();
  }

  return (
    <>
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 rounded-md bg-white/6"
            aria-label="Open sidebar"
            onClick={() => onOpenSidebar && onOpenSidebar()}
          >
            ☰
          </button>

          <div>
            <h1 className="text-2xl font-bold">{greeting}</h1>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
         

          <div className="flex items-center gap-3">
            <button
              onClick={() => setConfirmOpen(true)}
              aria-label="Sign out"
              className="ml-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm shadow-md hover:scale-105 transform transition-transform duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
            <h3 className="text-lg font-semibold">Confirm sign out</h3>
            <p className="mt-2 text-sm text-gray-600">Are you sure you want to sign out?</p>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setConfirmOpen(false)} className="px-3 py-1 rounded-md border border-gray-200 text-sm">No</button>
              <button onClick={doSignOut} className="px-3 py-1 rounded-md bg-red-600 text-white text-sm">Yes, sign out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
