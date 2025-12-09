import React from "react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold">My Blog</h1>
        <p className="text-sm text-gray-500">Admin</p>
      </div>

      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/posts" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              Posts
            </Link>
          </li>
          <li>
            <Link href="/" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              View site
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
