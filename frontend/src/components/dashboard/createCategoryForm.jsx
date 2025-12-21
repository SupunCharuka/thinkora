"use client";
import React, { useState, useEffect } from 'react';

function generateSlug(str = '') {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
    .replace(/-+/g, '-');
}

export default function CreateCategoryForm({ onCreated, category, onUpdated, showHeader = true }) {
  const [name, setName] = useState(category?.name || '');
  const [slug, setSlug] = useState(category?.slug || '');
  const [description, setDescription] = useState(category?.description || '');
  const [status, setStatus] = useState(null); // null | saving | created | error | message string
  const [autoSlug, setAutoSlug] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (autoSlug) {
      setSlug(generateSlug(name));
    }
  }, [name, autoSlug]);

  // Keep state in sync if category prop changes (useful when opening modal)
  useEffect(() => {
    setName(category?.name || '');
    setSlug(category?.slug || '');
    setDescription(category?.description || '');
  }, [category]);

  function validate() {
    const e = {};
    if (!name || !name.toString().trim()) e.name = 'Name is required';
    if (slug && !/^[a-z0-9\-_]+$/.test(slug)) e.slug = 'Slug may only contain lowercase letters, numbers, - and _';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;
    setStatus('saving');

    try {
      if (category && (category._id || category.id)) {
        // Update existing
        const id = category._id || category.id;
        const authToken = (typeof window !== 'undefined' && localStorage.getItem('token')) || null;
        const res = await fetch(`/api/v1/categories/${encodeURIComponent(id)}`, {
          method: 'PUT',
          headers: Object.assign({ 'Content-Type': 'application/json' }, authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          credentials: 'include',
          body: JSON.stringify({ name: name.trim(), slug: slug.trim(), description: description.trim() }),
        });
        const data = await res.json();
        if (!res.ok) {
          setStatus(data.message || 'Failed to update');
          return;
        }
        setStatus('updated');
        // Show success message briefly before notifying parent (so user sees the message in the modal)
        if (typeof onUpdated === 'function') {
          setTimeout(() => {
            try {
              onUpdated(data);
            } catch (e) {
              console.error('onUpdated handler error', e);
            }
          }, 700);
        }
      } else {
        // Create new
        const authToken = (typeof window !== 'undefined' && localStorage.getItem('token')) || null;
        const res = await fetch('/api/v1/categories', {
          method: 'POST',
          headers: Object.assign({ 'Content-Type': 'application/json' }, authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          credentials: 'include',
          body: JSON.stringify({ name: name.trim(), slug: slug.trim(), description: description.trim() }),
        });
        const data = await res.json();
        if (!res.ok) {
          setStatus(data.message || 'Failed to create');
          return;
        }
        setStatus('created');
        if (typeof onCreated === 'function') onCreated(data);
        // show success then reset
        setTimeout(() => {
          setName('');
          setSlug('');
          setDescription('');
          setStatus(null);
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to submit category', err);
      setStatus('Network error');
    }
  }

  return (
    <div className="mt-6 max-w">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {showHeader && (
          <div className="p-5 border-b border-gray-100  flex items-start gap-4">
            
            <div>
              <h3 className="text-lg font-semibold">{category ? 'Edit category' : 'Create category'}</h3>
              <p className="text-sm text-gray-600">{category ? 'Update category details.' : 'Add a new category for posts. Slug is used in URLs.'}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {(status === 'created' || status === 'updated') && (
            <div className="p-3 rounded-md bg-green-50 text-green-800">{status === 'created' ? 'Category created successfully' : 'Category updated successfully'}</div>
          )}
          {status && status !== 'saving' && status !== 'created' && status !== 'updated' && typeof status === 'string' && (
            <div className="p-3 rounded-md bg-red-50 text-red-800">{status}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 ">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-2 block w-full rounded-md border px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'}`}
                placeholder="e.g. News"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 ">Slug</label>
              <div className="mt-2 flex gap-2">
                <input
                  value={slug}
                  onChange={(e) => { setSlug(e.target.value); setAutoSlug(false); }}
                  className={`flex-1 rounded-md border px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 ${errors.slug ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'}`}
                  placeholder="auto-generated"
                  aria-invalid={!!errors.slug}
                />
                <button
                  type="button"
                  onClick={() => { setSlug(generateSlug(name)); setAutoSlug(true); }}
                  className="px-3 py-2 rounded-md border bg-white text-sm text-gray-700"
                >
                  Auto
                </button>
              </div>
              {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
              <p className="mt-1 text-xs text-gray-500">Preview: <span className="font-medium">/category/{slug || '...'}</span></p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 ">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Optional short description"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={status === 'saving'}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2"
              >
                {status === 'saving' ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  category ? 'Update' : 'Create'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (category) {
                    setName(category.name || '');
                    setSlug(category.slug || '');
                    setDescription(category.description || '');
                  } else {
                    setName('');
                    setSlug('');
                    setDescription('');
                  }
                  setStatus(null);
                  setErrors({});
                }}
                className="px-3 py-2 rounded-md border bg-white text-sm"
              >
                Reset
              </button>
            </div>

            <div className="text-sm text-gray-500">Fields marked required are validated before submission.</div>
          </div>
        </form>
      </div>
    </div>
  );
}
