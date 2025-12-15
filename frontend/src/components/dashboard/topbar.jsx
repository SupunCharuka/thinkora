"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Topbar({ onOpenSidebar }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function doSignOut() {
    (async () => {
      try {
        // Call our frontend logout proxy which clears the HttpOnly token cookie
        await fetch('/api/v1/auth/logout', { method: 'POST' });
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
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-500">Realtime overview</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-md shadow hidden sm:inline-block">New blog</button>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full bg-white/10">🔔</button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-yellow-400 flex items-center justify-center text-sm font-semibold">SC</div>
            <button onClick={() => setConfirmOpen(true)} className="ml-2 px-3 py-1 rounded-md bg-red-600 text-white text-sm">Sign out</button>
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
