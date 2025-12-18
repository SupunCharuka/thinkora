"use client";
import React, { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";
import MobileSidebar from "@/components/dashboard/mobileSidebar";

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        <aside className="w-64 hidden md:block">
          <Sidebar />
        </aside>

        <main className="flex-1 p-6">
          <Topbar onOpenSidebar={() => setMobileOpen(true)} />
          {children}
        </main>
      </div>

      <MobileSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </div>
  );
}
