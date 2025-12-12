"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";
import StatCard from "@/components/dashboard/statCard";
import BlogsTable from "@/components/dashboard/blogsTable";
import blogs from "@/data/blogs";
import { useRouter } from 'next/navigation';



export default function DashboardPage() {
  const totalblogs = blogs.length;
  const categories = Array.from(new Set(blogs.map((p) => p.category))).length;
  const latest = blogs.slice().sort((a, b) => (a.date < b.date ? 1 : -1))[0];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [backendMsg, setBackendMsg] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch protected dashboard data from our frontend proxy API
    async function load() {
      try {
        const res = await fetch('/api/v1/dashboard', { method: 'GET', credentials: 'same-origin' });
        if (res.status === 401) {
          // Not authenticated — redirect to login
          router.push('/login');
          return;
        }
        const data = await res.json();
        setBackendMsg(data.message || JSON.stringify(data));
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    }

    load();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex">
        <aside className="w-64 hidden md:block">
          <Sidebar />
        </aside>

        <main className="flex-1 p-6">
          <Topbar onOpenSidebar={() => setMobileOpen(true)} />

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="Total blogs" value={totalblogs} />
            <StatCard title="Categories" value={categories} />
            <StatCard title="Latest blog" value={latest?.title || "—"} />
          </div>

          {backendMsg && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded">
              <strong>Backend:</strong> <span>{backendMsg}</span>
            </div>
          )}

          <section className="mt-8">
            <h2 className="text-lg font-semibold">Blogs</h2>
            <div className="mt-4 bg-white dark:bg-gray-800 shadow rounded-md">
              <BlogsTable  />
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
