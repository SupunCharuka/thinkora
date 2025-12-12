"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/sidebar';
import Topbar from '@/components/dashboard/topbar';
import CreateCategoryForm from '@/components/dashboard/createCategoryForm';
import CategoryTable from '@/components/dashboard/categoryTable';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function verify() {
      try {
        const res = await fetch('/api/v1/dashboard', { method: 'GET', credentials: 'same-origin' });
        if (!mounted) return;
        if (res.status === 401) {
          router.push('/login');
          return;
        }
      } catch (err) {
        console.error('Auth check failed', err);
        router.push('/login');
        return;
      } finally {
        if (mounted) setChecking(false);
      }
    }

    verify();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading…</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
