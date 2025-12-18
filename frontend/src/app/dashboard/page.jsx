"use client";
import React from "react";
import useDashboardAuth from '@/hooks/useDashboardAuth';
import StatCard from '@/components/dashboard/statCard';
import Link from "next/link";


export default function DashboardPage() {

  const { data, message: backendMsg, loading, error } = useDashboardAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white/60 p-6 text-slate-900">
      <div className="max-w-7xl mx-auto flex gap-6">
        
        <main className="flex-1">
          

          <div className="mt-6 space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-lg p-4 bg-white/40 shadow animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                    <div className="h-10 bg-gray-200 rounded w-2/3" />
                  </div>
                ))
              ) : (
                <>
                  <StatCard title="Total Blogs" value={(data && typeof data.totalBlogs !== 'undefined') ? data.totalBlogs : '—'} variant="indigo" />
                  <StatCard title="Published" value={(data && typeof data.published !== 'undefined') ? data.published : '—'} variant="teal" />
                  <StatCard title="Private" value={(data && typeof data.private !== 'undefined') ? data.private : '—'} variant="slate" />
                </>
              )}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow">
                <h2 className="text-lg font-semibold">Overview</h2>
                <p className="mt-2 text-sm text-gray-600">A quick summary of your site and recent backend status.</p>

                <div className="mt-4">
                  {error && <div className="text-sm text-red-600">Error: {error}</div>}

                  {loading ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                    </div>
                  ) : (
                    <div className="mt-3 bg-gradient-to-r from-indigo-50 to-white rounded-lg p-4 border border-white/5">
                      <h3 className="text-sm font-medium">Backend message</h3>
                      <pre className="mt-2 text-xs text-gray-700 overflow-x-auto p-2 bg-white rounded">{JSON.stringify(backendMsg, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>

              <aside className="bg-white rounded-lg p-6 shadow">
                <h3 className="text-sm font-semibold">Quick actions</h3>
                <div className="mt-3 flex flex-col gap-3">
                  {loading ? (
                    <>
                      <div className="h-9 bg-gray-200 rounded w-full animate-pulse" />
                      <div className="h-9 bg-gray-200 rounded w-full animate-pulse" />
                      <div className="h-9 bg-gray-200 rounded w-full animate-pulse" />
                    </>
                  ) : (
                    <>
                      <Link href="/dashboard/create-blog" className="inline-block px-3 py-2 rounded-md bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm text-center">Create blog</Link>
                      <Link href="/dashboard/blogs" className="inline-block px-3 py-2 rounded-md border border-gray-200 text-sm text-center">View blogs</Link>
                      <Link href="/dashboard/categories" className="inline-block px-3 py-2 rounded-md border border-gray-200 text-sm text-center">Manage categories</Link>
                    </>
                  )}
                </div>
              </aside>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
