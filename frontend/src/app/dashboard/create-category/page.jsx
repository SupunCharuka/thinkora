import React from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import Topbar from '@/components/dashboard/topbar';
import CreateCategoryForm from '../../../components/dashboard/createCategoryForm';

export default function CreateCategoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex">
        <aside className="w-64 hidden md:block">
          <Sidebar />
        </aside>

        <main className="flex-1 p-6">
          <Topbar />

          <div className="mt-6">
            <h2 className="text-lg font-semibold">Create Category</h2>
            <CreateCategoryForm />
          </div>
        </main>
      </div>
    </div>
  );
}
