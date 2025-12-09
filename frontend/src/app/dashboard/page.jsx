"use client";
import React, { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import StatCard from "@/components/dashboard/StatCard";
import PostsTable from "@/components/dashboard/PostsTable";
import posts from "@/data/posts";



export default function DashboardPage() {
  const totalPosts = posts.length;
  const categories = Array.from(new Set(posts.map((p) => p.category))).length;
  const latest = posts.slice().sort((a, b) => (a.date < b.date ? 1 : -1))[0];

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex">
        <aside className="w-64 hidden md:block">
          <Sidebar />
        </aside>

        <main className="flex-1 p-6">
          <Topbar onOpenSidebar={() => setMobileOpen(true)} />

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="Total posts" value={totalPosts} />
            <StatCard title="Categories" value={categories} />
            <StatCard title="Latest post" value={latest?.title || "—"} />
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-semibold">Posts</h2>
            <div className="mt-4 bg-white dark:bg-gray-800 shadow rounded-md">
              <PostsTable  />
            </div>
          </section>
        </main>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72">
            <Sidebar mobile onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

    </div>
  );
}
