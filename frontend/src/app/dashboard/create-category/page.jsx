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
      <div className="min-h-screen flex items-center justify-center">Loading…</div>
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
