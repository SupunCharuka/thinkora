"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CreateBlogForm from '@/components/dashboard/createBlogForm';
import useDashboardAuth from '@/hooks/useDashboardAuth';

export default function CreateBlogPage() {
  const { loading } = useDashboardAuth();
  const [initial, setInitial] = useState(null);
  const [editParam, setEditParam] = useState(null);
  const searchParams = useSearchParams();

  // react to search param changes (client navigation may keep the same page/component mounted)
  useEffect(() => {
    try {
      const e = searchParams ? searchParams.get('edit') : null;
      setEditParam(e);
    } catch (err) {
      // fallback: clear edit param
      setEditParam(null);
    }
  }, [searchParams]);

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

  if (loading) return (
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
          <div className="max-w-3xl mx-auto">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-6 animate-pulse" />

            <div className="space-y-4">
              <div className="h-12 bg-slate-200 rounded animate-pulse" />
              <div className="h-12 bg-slate-200 rounded animate-pulse" />
              <div className="h-40 bg-slate-200 rounded animate-pulse" />
              <div className="h-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-12 bg-slate-200 rounded animate-pulse w-32" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
       

        <main className="flex-1 p-6">
          

          <div className="mt-6">
            <CreateBlogForm initial={initial} />
          </div>
        </main>
      </div>
    </div>
  );
}
