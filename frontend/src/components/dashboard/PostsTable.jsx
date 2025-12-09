import React from "react";
import Link from "next/link";

export default function PostsTable({ posts }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {posts.map((post) => (
            <tr key={post.slug} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href={`/posts/${post.slug}`} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                  {post.title}
                </Link>
                <div className="text-xs text-gray-500">{post.excerpt}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.category}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
