"use client";
import React, { useState } from 'react';

export default function CreateCategoryForm() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('saving');
    try {
      const res = await fetch('/api/v1/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ name, slug, description }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.message || 'Failed');
        return;
      }
      setStatus('created');
      setName('');
      setSlug('');
      setDescription('');
    } catch (err) {
      console.error('Failed to create category', err);
      setStatus('error');
    }
  }

  return (
    <div className="mt-6 p-4 bg-white dark:bg-gray-800 shadow rounded-md">
      <h3 className="text-sm font-semibold mb-2">Create Category</h3>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label className="block text-xs">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label className="block text-xs">Slug (optional)</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label className="block text-xs">Description (optional)</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>
        <div className="flex items-center gap-2">
          <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded" disabled={status === 'saving'}>
            {status === 'saving' ? 'Saving...' : 'Create'}
          </button>
          {status === 'created' && <span className="text-sm text-green-600">Created</span>}
          {status && status !== 'created' && status !== 'saving' && <span className="text-sm text-red-600">{status}</span>}
        </div>
      </form>
    </div>
  );
}
