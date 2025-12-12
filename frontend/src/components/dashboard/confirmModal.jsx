"use client";
import React from 'react';

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, confirmLabel = 'Delete', cancelLabel = 'Cancel', processing = false }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold">{title || 'Confirm'}</h3>
          </div>

          <div className="p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button onClick={onCancel} className="px-3 py-2 rounded-md border bg-white dark:bg-gray-900 text-sm">
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={processing}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 hover:bg-red-700 text-white px-4 py-2"
              >
                {processing ? 'Deleting…' : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
