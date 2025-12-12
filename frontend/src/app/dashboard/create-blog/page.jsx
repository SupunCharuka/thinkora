"use client";
import React from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import Topbar from '@/components/dashboard/topbar';
import CreateBlogForm from '@/components/dashboard/createBlogForm';
import useDashboardAuth from '@/hooks/useDashboardAuth';

export default function CreateBlogPage() {
  const { loading } = useDashboardAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex">
        <aside className="w-64 hidden md:block">
          <Sidebar />
        </aside>

        <main className="flex-1 p-6">
          <Topbar />

          <div className="mt-6">
            <CreateBlogForm onCreated={(b) => { /* optionally navigate to blog page or refresh */ }} />
          </div>
        </main>
      </div>
    </div>
  );
}
