"use client";
import React from "react";
import StatCard from "@/components/dashboard/statCard";
import BlogsTable from "@/components/dashboard/blogsTable";
import blogs from "@/data/blogs";
import useDashboardAuth from '@/hooks/useDashboardAuth';



export default function DashboardPage() {
  const totalblogs = blogs.length;
  const categories = Array.from(new Set(blogs.map((p) => p.category))).length;
  const latest = blogs.slice().sort((a, b) => (a.date < b.date ? 1 : -1))[0];

  const { message: backendMsg, loading, error } = useDashboardAuth();

  return (
    <>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total blogs" value={totalblogs} />
        <StatCard title="Categories" value={categories} />
        <StatCard title="Latest blog" value={latest?.title || "—"} />
      </div>

      {loading ? (
        <div className="mt-6 p-4 bg-yellow-50 rounded">
          Loading dashboard data...
        </div>
      ) : error ? (
        <div className="mt-6 p-4 bg-red-50 rounded">
          <strong>Error:</strong> <span>{error}</span>
        </div>
      ) : backendMsg ? (
        <div className="mt-6 p-4 bg-blue-50 rounded">
          <strong>Backend:</strong> <span>{backendMsg}</span>
        </div>
      ) : null}

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Blogs</h2>
        <div className="mt-4 bg-white shadow rounded-md">
          <BlogsTable />
        </div>
      </section>
    </>
  );
}
