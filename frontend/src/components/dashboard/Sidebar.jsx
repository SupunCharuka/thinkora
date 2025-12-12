import React from "react";
import Link from "next/link";

export default function Sidebar({ mobile = false, onClose }) {
  return (
    <div className="h-full p-6 bg-gradient-to-b from-white/40 to-white/10 backdrop-blur-sm dark:from-black/40 dark:to-black/20 border-r border-white/5">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Analytics</h1>
          <p className="text-xs text-gray-600 dark:text-gray-300">Dashboard</p>
        </div>
        {mobile && (
          <button onClick={() => onClose && onClose()} aria-label="Close sidebar" className="ml-4 p-2 rounded-md bg-white/6">
            ✕
          </button>
        )}
      </div>

      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 dark:hover:bg-white/5">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-sm font-medium">Overview</span>
            </Link>
          </li>
          <li>
            <Link href="/blogs" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 dark:hover:bg-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-sm font-medium">Blogs</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/create-category" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 dark:hover:bg-white/5">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-sm font-medium">Create category</span>
            </Link>
          </li>
          <li>
            <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 dark:hover:bg-white/5">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="text-sm font-medium">View site</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-8 text-xs text-gray-500 dark:text-gray-400">
        Quick tips
        <div className="mt-2 text-xs">Use the cards to monitor traffic and content performance.</div>
      </div>
    </div>
  );
}
