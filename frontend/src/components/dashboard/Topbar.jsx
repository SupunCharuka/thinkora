import React from "react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your site content</p>
      </div>

      <div className="flex items-center space-x-4">
        <button className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500">New post</button>
        <div className="text-sm text-gray-600 dark:text-gray-300">Admin</div>
      </div>
    </header>
  );
}
