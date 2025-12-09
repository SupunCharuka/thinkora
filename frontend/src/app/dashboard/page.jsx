import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import StatCard from "@/components/dashboard/StatCard";
import PostsTable from "@/components/dashboard/PostsTable";
import posts from "@/data/posts";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  const totalPosts = posts.length;
  const categories = Array.from(new Set(posts.map((p) => p.category))).length;
  const latest = posts.slice().sort((a, b) => (a.date < b.date ? 1 : -1))[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex">
        <aside className="w-64 hidden md:block">
          <Sidebar />
        </aside>

        <main className="flex-1 p-6">
          <Topbar />

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="Total posts" value={totalPosts} />
            <StatCard title="Categories" value={categories} />
            <StatCard title="Latest post" value={latest?.title || "—"} />
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-semibold">Posts</h2>
            <div className="mt-4 bg-white dark:bg-gray-800 shadow rounded-md">
              <PostsTable posts={posts} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
