"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Editor } from 'primereact/editor';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

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
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [published, setPublished] = useState(true);
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState(null);
  const [autoSlug, setAutoSlug] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (autoSlug) setSlug(generateSlug(title));
  }, [title, autoSlug]);

  useEffect(() => {
    // Load categories from backend (public endpoint)
    async function loadCategories() {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${base}/api/v1/categories`);
        if (!res.ok) return;
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, []);

  function validate() {
    const e = {};
    if (!title || !title.toString().trim()) e.title = 'Title is required';
    const textOnly = content ? content.replace(/<[^>]*>/g, '').trim() : '';
    if (!textOnly) e.content = 'Content is required';
    if (!category || !String(category).trim()) e.category = 'Category is required';
    if (!image) e.image = 'Image is required';
    if (slug && !/^[a-z0-9\-_]+$/.test(slug)) e.slug = 'Slug may only contain lowercase letters, numbers, - and _';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function formatBytes(bytes) {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${sizes[i]}`;
  }

  function handleFileSelect(files) {
    const f = files && files[0];
    if (f) {
      setImage(f);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(f));
      // clear previous error for image
      setErrors((prev) => ({ ...prev, image: undefined }));
    } else {
      setImage(null);
      if (imagePreview) { URL.revokeObjectURL(imagePreview); setImagePreview(null); }
    }
  }

  function handleRemoveImage() {
    setImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;
    setStatus('saving');
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const form = new FormData();
      form.append('title', title.trim());
      form.append('slug', slug.trim());
      form.append('excerpt', excerpt.trim());
      form.append('content', content.trim());
      form.append('category', category);
      form.append('published', String(published));
      if (image) form.append('image', image);

      const headers = {};
      // Attach Authorization header when a token is available (login stored it in localStorage)
      try {
        const stored = localStorage.getItem('token');
        if (stored) headers.Authorization = `Bearer ${stored}`;
      } catch (e) {
        // ignore - localStorage not available
      }

      const res = await fetch(`${base}/api/v1/blogs`, {
        method: 'POST',
        credentials: base ? 'include' : 'same-origin',
        headers,
        body: form,
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
        setImage(null);
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
          setImagePreview(null);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
        setCategory('');
        setStatus(null);
      }, 1000);
    } catch (err) {
      console.error('Failed to create blog', err);
      setStatus('Network error');
    }
  }

  return (
    <div className="mt-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-5 border-b border-gray-100 ">
          <h3 className="text-lg font-semibold">Create blog</h3>
          <p className="text-sm text-gray-600 ">Add a new blog post.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">


          <div>
            <label className="block text-xs font-medium text-gray-700 ">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={`mt-2 block w-full rounded-md border px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 ${errors.title ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'}`} />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 ">Slug</label>
            <div className="mt-2 flex gap-2">
              <input value={slug} onChange={(e) => { setSlug(e.target.value); setAutoSlug(false); }} className={`flex-1 rounded-md border px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 ${errors.slug ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'}`} placeholder="auto-generated" />
              <button type="button" onClick={() => { setSlug(generateSlug(title)); setAutoSlug(true); }} className="px-3 py-2 rounded-md border bg-white text-sm">Auto</button>
            </div>
            {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 ">Excerpt</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="mt-2 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={2} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 ">Category</label>
            <div className="mt-2">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={`block w-full rounded-md border px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 ${errors.category ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'}`}>
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 ">Image</label>
            <div className="mt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(ev) => handleFileSelect(ev?.target?.files)}
                className="hidden"
                aria-hidden="true"
              />

              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current && fileInputRef.current.click(); }}
                onDrop={(e) => { e.preventDefault(); handleFileSelect(e.dataTransfer.files); }}
                onDragOver={(e) => e.preventDefault()}
                className={`mt-2 flex items-center justify-center flex-col gap-2 border-2 border-dashed rounded-lg p-4 cursor-pointer transition ${errors.image ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-indigo-400'}`}
              >
                {!imagePreview ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4m-6 8h20" />
                    </svg>
                    <div className="text-sm text-gray-600 ">Click or drag an image here</div>
                    <div className="text-xs text-gray-400">PNG, JPG, GIF — max {Math.round((parseInt(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE || '10485760', 10) / 1024 / 1024) * 10) / 10}MB</div>
                  </>
                ) : (
                  <div className="w-full flex items-center gap-3">
                    <img src={imagePreview} alt="preview" className="h-20 w-20 object-cover rounded-md border" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{image && image.name}</div>
                      <div className="text-xs text-gray-500">{image && formatBytes(image.size)}</div>
                      <div className="mt-2 flex gap-2">
                        <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} className="text-sm px-2 py-1 rounded border bg-white">Change</button>
                        <button type="button" onClick={handleRemoveImage} className="text-sm px-2 py-1 rounded border bg-red-50 text-red-700">Remove</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 ">Content</label>
            <div className={`mt-2 ${errors.content ? 'ring-2 ring-red-200 rounded' : ''}`}>
              <Editor value={content} onTextChange={(e) => setContent(e.htmlValue)} style={{ height: '320px' }} />
            </div>
            {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content}</p>}
          </div>

           <div>
            <label className="block text-xs font-medium text-gray-700">Visibility</label>
            <div className="mt-2">
              <select value={String(published)} onChange={(e) => setPublished(e.target.value === 'true')} className="block w-48 rounded-md border px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 border-gray-200 focus:ring-indigo-500">
                <option value="true">Public</option>
                <option value="false">Private</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">Private posts are only visible to you when signed in.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={status === 'saving'} className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2">
              {status === 'saving' ? <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg> : 'Create'}
            </button>
            <button type="button" onClick={() => {
              setTitle(''); setSlug(''); setExcerpt(''); setContent('');
              setStatus(null); setErrors({}); setImage(null);
              setPublished(true);
              if (imagePreview) { URL.revokeObjectURL(imagePreview); setImagePreview(null); }
              if (fileInputRef.current) fileInputRef.current.value = '';
            }} className="px-3 py-2 rounded-md border bg-white text-sm">Reset</button>
          </div>

         

          {status === 'created' && <div className="p-3 rounded-md bg-green-50 text-green-800">Blog created successfully</div>}
          {status && status !== 'saving' && status !== 'created' && typeof status === 'string' && (
            <div className="p-3 rounded-md bg-red-50 text-red-800">{status}</div>
          )}
        </form>
      </div>
    </div>
  );
}
