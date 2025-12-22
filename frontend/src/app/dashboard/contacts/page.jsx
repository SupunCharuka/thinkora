"use client";
import React from 'react';
import useDashboardAuth from '@/hooks/useDashboardAuth';
import ContactsTable from '@/components/dashboard/contactsTable';

export default function DashboardContactsPage() {
  const { data, loading, error } = useDashboardAuth();

  // If not authenticated, `useDashboardAuth` will provide error or redirect
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white/60 p-6 text-slate-900">
      <div className="max-w-7xl mx-auto">
        <main>
          
          <ContactsTable />
        </main>
      </div>
    </div>
  );
}
