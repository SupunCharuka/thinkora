import React from "react";

export default function StatCard({ title, value }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-md">
      <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}
