"use client";
import React from 'react';

export default function EditCategoryModal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-2xl mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold">{title || 'Edit'}</h3>
            <button onClick={onClose} className="px-2 py-1 rounded-md border bg-white dark:bg-gray-900 text-sm">
              Close
            </button>
          </div>

          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
