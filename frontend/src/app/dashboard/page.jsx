"use client";
import React, { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";
import StatCard from "@/components/dashboard/statCard";
import ArticlesTable from "@/components/dashboard/articlesTable";
import articles from "@/data/articles";



export default function DashboardPage() {
  const totalarticles = articles.length;
  const categories = Array.from(new Set(articles.map((p) => p.category))).length;
  const latest = articles.slice().sort((a, b) => (a.date < b.date ? 1 : -1))[0];

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
            <StatCard title="Total articles" value={totalarticles} />
            <StatCard title="Categories" value={categories} />
            <StatCard title="Latest article" value={latest?.title || "—"} />
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-semibold">Articles</h2>
            <div className="mt-4 bg-white dark:bg-gray-800 shadow rounded-md">
              <ArticlesTable  />
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
