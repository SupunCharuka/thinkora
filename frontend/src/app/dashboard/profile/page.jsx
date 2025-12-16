"use client";
import React from "react";
import Sidebar from "@/components/dashboard/sidebar";
import ProfileSettings from "@/components/dashboard/profileSettings";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        <aside className="w-64 hidden md:block">
          <Sidebar />
        </aside>

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Profile settings</h1>
          <div className="mt-4 bg-white shadow rounded-md">
            <ProfileSettings />
          </div>
        </main>
      </div>
    </div>
  );
}
