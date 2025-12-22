"use client";
import React from "react";
import Sidebar from "@/components/dashboard/sidebar";
import ProfileSettings from "@/components/dashboard/profileSettings";
import useDashboardAuth from "@/hooks/useDashboardAuth";

export default function ProfilePage() {
  const { loading: checking } = useDashboardAuth();
  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <aside className="w-64 hidden md:block p-6">
            <div className="space-y-4">
              <div className="h-6 bg-slate-200 rounded w-2/3 animate-pulse" />
              <div className="h-10 bg-slate-200 rounded animate-pulse" />
              <div className="h-10 bg-slate-200 rounded animate-pulse" />
              <div className="h-10 bg-slate-200 rounded animate-pulse" />
            </div>
          </aside>

          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="h-8 bg-slate-200 rounded w-1/3 mb-6 animate-pulse" />

              <div className="bg-white shadow rounded-md p-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="h-14 bg-slate-200 rounded animate-pulse" />
                  <div className="h-12 bg-slate-200 rounded animate-pulse" />
                  <div className="h-12 bg-slate-200 rounded animate-pulse" />
                  <div className="h-32 bg-slate-200 rounded animate-pulse" />
                </div>
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


        <main className="flex-1 p-6">
          
          <div className="mt-4 bg-white shadow rounded-md p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-2">Profile settings</h3>
            <p className="text-sm text-gray-500 mb-3">Manage your profile information and settings.</p>

            <ProfileSettings />
          </div>
        </main>
      </div>
    </div>
  );
}
