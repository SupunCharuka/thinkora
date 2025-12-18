"use client";
import React from "react";
import Sidebar from "@/components/dashboard/sidebar";

export default function MobileSidebar({ mobileOpen = false, onClose }) {
  if (!mobileOpen) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-72">
        <Sidebar mobile onClose={onClose} />
      </div>
    </div>
  );
}
