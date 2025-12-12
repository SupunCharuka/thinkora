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

export default function CreateBlogForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState(null);
  const [autoSlug, setAutoSlug] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (autoSlug) setSlug(generateSlug(title));
  }, [title, autoSlug]);

  function validate() {
    const e = {};
    if (!title || !title.toString().trim()) e.title = 'Title is required';
    if (!content || !content.toString().trim()) e.content = 'Content is required';
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
      const res = await fetch('/api/v1/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ title: title.trim(), slug: slug.trim(), excerpt: excerpt.trim(), content: content.trim(), category }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.message || 'Failed to create blog');
        return;
      }
      setStatus('created');
      if (typeof onCreated === 'function') onCreated(data);
      setTimeout(() => {
        setTitle('');
        setSlug('');
        setExcerpt('');
        setContent('');
        setCategory('');
        setStatus(null);
      }, 800);
    } catch (err) {
      console.error('Failed to create blog', err);
      setStatus('Network error');
    }
  }

  return (
    <div className="mt-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold">Create blog</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Add a new blog post.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {status === 'created' && <div className="p-3 rounded-md bg-green-50 dark:bg-green-900 text-green-800">Blog created successfully</div>}
          {status && status !== 'saving' && status !== 'created' && typeof status === 'string' && (
            <div className="p-3 rounded-md bg-red-50 dark:bg-red-900 text-red-800">{status}</div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={`mt-2 block w-full rounded-md border px-3 py-2 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 ${errors.title ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'}`} />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Slug</label>
            <div className="mt-2 flex gap-2">
              <input value={slug} onChange={(e) => { setSlug(e.target.value); setAutoSlug(false); }} className={`flex-1 rounded-md border px-3 py-2 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 ${errors.slug ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'}`} placeholder="auto-generated" />
              <button type="button" onClick={() => { setSlug(generateSlug(title)); setAutoSlug(true); }} className="px-3 py-2 rounded-md border bg-white dark:bg-gray-800 text-sm">Auto</button>
            </div>
            {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Excerpt</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="mt-2 block w-full rounded-md border border-gray-200 bg-gray-50 dark:bg-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={2} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className={`mt-2 block w-full rounded-md border px-3 py-2 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 ${errors.content ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'}`} rows={8} />
            {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content}</p>}
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={status === 'saving'} className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2">
              {status === 'saving' ? <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg> : 'Create'}
            </button>
            <button type="button" onClick={() => { setTitle(''); setSlug(''); setExcerpt(''); setContent(''); setStatus(null); setErrors({}); }} className="px-3 py-2 rounded-md border bg-white dark:bg-gray-800 text-sm">Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
}
