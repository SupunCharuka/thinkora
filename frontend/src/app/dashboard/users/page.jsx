"use client";
import React from 'react';
import useDashboardAuth from '@/hooks/useDashboardAuth';
import UsersTable from '@/components/dashboard/usersTable';

export default function UsersPage() {
  const { loading: checking } = useDashboardAuth();
  const [refreshKey, setRefreshKey] = React.useState(0);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="h-8 bg-slate-200 rounded w-1/3 mb-6 animate-pulse" />
              <div className="h-40 bg-slate-200 rounded animate-pulse" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        <main className="flex-1 p-6">
          <div className="mt-6">
            <UsersTable refreshKey={refreshKey} />
          </div>
        </main>
      </div>
    </div>
  );
}
