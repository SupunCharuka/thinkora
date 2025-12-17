"use client";
import React from 'react';
import useDashboardAuth from '@/hooks/useDashboardAuth';
import Sidebar from '@/components/dashboard/sidebar';
import Topbar from '@/components/dashboard/topbar';
import CreateCategoryForm from '@/components/dashboard/createCategoryForm';
import CategoryTable from '@/components/dashboard/categoryTable';

export default function CreateCategoryPage() {
  const { loading: checking } = useDashboardAuth();
  const [refreshKey, setRefreshKey] = React.useState(0);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <aside className="w-64 hidden md:block p-6">
            <div className="space-y-4">
              <div className="h-6 bg-slate-200 rounded w-2/3 animate-pulse" />
              <div className="h-10 bg-slate-200 rounded" />
              <div className="h-10 bg-slate-200 rounded" />
              <div className="h-10 bg-slate-200 rounded" />
            </div>
          </aside>

          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="h-8 bg-slate-200 rounded w-1/3 mb-6 animate-pulse" />

              <div className="grid grid-cols-1 gap-4">
                <div className="h-12 bg-slate-200 rounded animate-pulse" />
                <div className="h-12 bg-slate-200 rounded animate-pulse" />
                <div className="h-12 bg-slate-200 rounded animate-pulse" />
                <div className="h-12 bg-slate-200 rounded animate-pulse" />
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-40 bg-slate-200 rounded animate-pulse" />
                <div className="h-40 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        <aside className="w-64 hidden md:block">
          <Sidebar />
        </aside>

        <main className="flex-1 p-6">
          <Topbar />

          <div className="mt-6">
          
            <CreateCategoryForm onCreated={() => setRefreshKey((k) => k + 1)} />
            <CategoryTable refreshKey={refreshKey} />
          </div>
        </main>
      </div>
    </div>
  );
}
