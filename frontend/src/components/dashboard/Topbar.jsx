import React from "react";

export default function Topbar({ onOpenSidebar }) {
  return (
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
          <p className="text-sm text-gray-500 dark:text-gray-400">Realtime overview</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-md shadow hidden sm:inline-block">New blog</button>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full bg-white/10">🔔</button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-yellow-400 flex items-center justify-center text-sm font-semibold">SC</div>
        </div>
      </div>
    </header>
  );
}
