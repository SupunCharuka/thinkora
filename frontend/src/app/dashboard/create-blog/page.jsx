"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import Topbar from '@/components/dashboard/topbar';
import CreateBlogForm from '@/components/dashboard/createBlogForm';
import useDashboardAuth from '@/hooks/useDashboardAuth';
import { useSearchParams } from 'next/navigation';

export default function CreateBlogPage() {
  const { loading } = useDashboardAuth();
  const searchParams = useSearchParams();
  const [initial, setInitial] = useState(null);
  const editParam = searchParams ? searchParams.get('edit') : null;

  useEffect(() => {
    if (!editParam) {
      // ensure we clear any previous initial when navigating to create without edit
      setInitial(null);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || '';
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch(`${base}/api/v1/blogs/${encodeURIComponent(editParam)}`, { headers, credentials: base ? 'include' : 'same-origin' });
        if (!res.ok) {
          console.error('Failed to load blog for edit', res.status);
          return;
        }
        const data = await res.json();
        if (mounted) setInitial(data);
      } catch (err) {
        console.error('Failed to fetch blog for edit', err);
      }
    })();
    return () => { mounted = false; };
  }, [editParam]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        <aside className="w-64 hidden md:block">
          <Sidebar />
        </aside>

        <main className="flex-1 p-6">
          <Topbar />

          <div className="mt-6">
            <CreateBlogForm initial={initial} />
          </div>
        </main>
      </div>
    </div>
  );
}
