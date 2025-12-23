"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Editor } from 'primereact/editor';
import { Toast } from 'primereact/toast';
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

export default function CreateBlogForm({ onCreated, initial }) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]); // { url, name, size, isExisting }
  const galleryInputRef = useRef(null);
  const [published, setPublished] = useState(true);
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState(null);
  const toast = useRef(null);
  const [autoSlug, setAutoSlug] = useState(true);
  const [errors, setErrors] = useState({});
  const isEdit = !!(initial && (initial._id || initial.slug));

  // Populate form when editing
  useEffect(() => {
    if (!initial) {
      // reset to defaults when switching to create mode
      setTitle('');
      setSlug('');
      setExcerpt('');
      setContent('');
      setCategory('');
      setTags([]);
      setPublished(true);
      setImage(null);
      if (imagePreview) {
        try { URL.revokeObjectURL(imagePreview); } catch (e) { }
        setImagePreview(null);
      }
      // revoke and clear any gallery previews (newly-added object URLs)
      try {
        if (galleryPreviews && galleryPreviews.length) {
          galleryPreviews.forEach((p) => {
            if (p && !p.isExisting && p.url) {
              try { URL.revokeObjectURL(p.url); } catch (e) { }
            }
          });
        }
      } catch (e) { }
      setGalleryPreviews([]);
      setGalleryFiles([]);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
      return;
    }

    setTitle(initial.title || '');
    setSlug(initial.slug || '');
    setExcerpt(initial.excerpt || '');
    setContent(initial.content || '');
    setCategory(initial.category?._id || initial.category || '');
    // populate tags: accept array or comma-separated string
    if (initial.tags) {
      if (Array.isArray(initial.tags)) setTags(initial.tags.filter(Boolean));
      else setTags(String(initial.tags).split(/\s*,\s*/).filter(Boolean));
    } else {
      setTags([]);
    }
    setPublished(typeof initial.published !== 'undefined' ? !!initial.published : true);
    // set existing image preview when editing
    if (initial.image) {
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const imageUrl = /^https?:\/\//i.test(initial.image) ? initial.image : `${base}${initial.image.startsWith('/') ? '' : '/'}${initial.image}`;
      setImagePreview(imageUrl);
    }
    // populate gallery when editing
    if (initial.gallery) {
      let g = initial.gallery;
      if (!Array.isArray(g)) g = String(g).split(/\s*,\s*/).filter(Boolean);
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const previews = g.map((it) => {
        const url = /^https?:\/\//i.test(it) ? it : `${base}${it.startsWith('/') ? '' : '/'}${it}`;
        return { url, name: url.split('/').pop(), size: 0, isExisting: true };
      });
      setGalleryPreviews(previews);
    } else {
      setGalleryPreviews([]);
    }
  }, [initial]);

  useEffect(() => {
    if (autoSlug) setSlug(generateSlug(title));
  }, [title, autoSlug]);

  useEffect(() => {
    // Load categories from backend (public endpoint)
    async function loadCategories() {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL;
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
    if (!image && !(initial && initial.image)) e.image = 'Image is required';
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

  function handleGallerySelect(files) {
    if (!files) return;
    const list = Array.from(files);
    const newPreviews = list.map((f) => ({ url: URL.createObjectURL(f), name: f.name, size: f.size, isExisting: false }));
    setGalleryFiles((prev) => [...prev, ...list]);
    setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    // clear gallery-related error
    setErrors((prev) => ({ ...prev, gallery: undefined }));
  }

  function handleRemoveGallery(index) {
    // if the item is a newly added file, remove from galleryFiles and revoke url
    setGalleryPreviews((prev) => {
      const item = prev[index];
      if (item && !item.isExisting && item.url) {
        try { URL.revokeObjectURL(item.url); } catch (e) {}
      }
      const next = prev.slice(); next.splice(index, 1); return next;
    });
    setGalleryFiles((prev) => {
      // remove corresponding file by matching name and size for newly added items
      const next = prev.slice();
      const idx = next.findIndex((f) => f && f.name === galleryPreviews[index]?.name && f.size === galleryPreviews[index]?.size);
      if (idx >= 0) next.splice(idx, 1);
      return next;
    });
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
      if (tags && tags.length) form.append('tags', JSON.stringify(tags));
      form.append('published', String(published));
      if (image) form.append('image', image);
      // append new gallery files
      if (galleryFiles && galleryFiles.length) {
        galleryFiles.forEach((f) => form.append('gallery', f));
      }
      // include existing gallery URLs so backend can preserve them when editing
      if (isEdit) {
        const existing = galleryPreviews.filter((p) => p.isExisting).map((p) => p.url);
        if (existing && existing.length) form.append('existingGallery', JSON.stringify(existing));
      }
      const headers = {};
      // Attach Authorization header when a token is available (login stored it in localStorage)
      try {
        const stored = localStorage.getItem('token');
        if (stored) headers.Authorization = `Bearer ${stored}`;
      } catch (e) {
        // ignore - localStorage not available
      }

      // If editing, send PUT to update the blog
      const urlId = isEdit ? encodeURIComponent(String(initial._id || initial.slug)) : '';
      const res = await fetch(isEdit ? `${base}/api/v1/blogs/${urlId}` : `${base}/api/v1/blogs`, {
        method: isEdit ? 'PUT' : 'POST',
        credentials: base ? 'include' : 'same-origin',
        headers,
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data && data.message ? data.message : (isEdit ? 'Failed to update blog' : 'Failed to create blog');
        toast.current && toast.current.show({ severity: 'error', summary: 'Error', detail: msg, life: 4000 });
        setStatus(null);
        return;
      }
      // success
      if (isEdit) {
        toast.current && toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Blog updated successfully', life: 3000 });
      } else {
        toast.current && toast.current.show({ severity: 'success', summary: 'Created', detail: 'Blog created successfully', life: 3000 });
      }
      if (typeof onCreated === 'function') onCreated(data);
      // clear or refresh form state after success
      setTimeout(() => {
        try {
          // Revoke and clear any newly added gallery preview URLs
          if (galleryPreviews && galleryPreviews.length) {
            galleryPreviews.forEach((p) => {
              if (p && !p.isExisting && p.url) {
                try { URL.revokeObjectURL(p.url); } catch (e) { }
              }
            });
          }
        } catch (e) { }

        if (!isEdit) {
          // on create: clear entire form including gallery previews/files
          setTitle('');
          setSlug('');
          setExcerpt('');
          setContent('');
          setImage(null);
          setTags([]);
          if (imagePreview && image && image.preview) {
            try { URL.revokeObjectURL(imagePreview); } catch (e) { }
            setImagePreview(null);
          }
          setGalleryPreviews([]);
          setGalleryFiles([]);
          if (galleryInputRef.current) galleryInputRef.current.value = '';
          if (fileInputRef.current) fileInputRef.current.value = '';
          setCategory('');
        } else {
          // on update: clear newly added files and update previews from server response when available
          setGalleryFiles([]);
          if (data && Array.isArray(data.gallery)) {
            const base = process.env.NEXT_PUBLIC_API_URL || '';
            const previews = data.gallery.map((it) => {
              const url = /^https?:\/\//i.test(it) ? it : `${base}${it.startsWith('/') ? '' : '/'}${it}`;
              return { url, name: url.split('/').pop(), size: 0, isExisting: true };
            });
            setGalleryPreviews(previews);
          } else {
            // if backend didn't return gallery, keep existing ones and remove newly added
            setGalleryPreviews((prev) => prev.filter((p) => p && p.isExisting));
          }
          if (galleryInputRef.current) galleryInputRef.current.value = '';
        }

        setStatus(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to create blog', err);
      toast.current && toast.current.show({ severity: 'error', summary: 'Error', detail: 'Network error', life: 4000 });
      setStatus(null);
    }
  }

  return (
    <div className="mt-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-5 border-b border-gray-100 ">
          <h3 className="text-lg font-semibold">{isEdit ? 'Edit blog' : 'Create blog'}</h3>
          <p className="text-sm text-gray-600 ">{isEdit ? 'Update your blog post.' : 'Add a new blog post.'}</p>
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
            <label className="block text-xs font-medium text-gray-700">Tags</label>
            <div className="mt-2 flex items-center gap-2">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const t = String(tagInput || '').trim();
                  if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
                  setTagInput('');
                }
              }} placeholder="Add a tag and press Enter" className="flex-1 rounded-md border px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 border-gray-200 focus:ring-indigo-500" />
              <button type="button" onClick={() => {
                const t = String(tagInput || '').trim();
                if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
                setTagInput('');
              }} className="px-3 py-2 rounded-md border bg-white text-sm">Add</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((t) => (
                <div key={t} className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-800">
                  <span>#{t}</span>
                  <button type="button" onClick={() => setTags((prev) => prev.filter((x) => x !== t))} className="text-xs text-red-600">×</button>
                </div>
              ))}
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
            <label className="block text-xs font-medium text-gray-700 ">Gallery images</label>
            <div className="mt-2">
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(ev) => handleGallerySelect(ev?.target?.files)}
                className="hidden"
                aria-hidden="true"
              />

              <div
                role="button"
                tabIndex={0}
                onClick={() => galleryInputRef.current && galleryInputRef.current.click()}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') galleryInputRef.current && galleryInputRef.current.click(); }}
                onDrop={(e) => { e.preventDefault(); handleGallerySelect(e.dataTransfer.files); }}
                onDragOver={(e) => e.preventDefault()}
                className={`mt-2 flex items-center justify-center flex-col gap-2 border-2 border-dashed rounded-lg p-4 cursor-pointer transition ${errors.gallery ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-indigo-400'}`}
              >
                {galleryPreviews.length === 0 ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4m-6 8h20" />
                    </svg>
                    <div className="text-sm text-gray-600 ">Click or drag images here</div>
                    <div className="text-xs text-gray-400">PNG, JPG, GIF — multiple files supported</div>
                  </>
                ) : (
                  <div className="w-full">
                    <div className="grid grid-cols-3 gap-3">
                      {galleryPreviews.map((p, idx) => (
                        <div key={p.url + idx} className="relative border rounded overflow-hidden">
                          <img src={p.url} alt={p.name} className="h-24 w-full object-cover" />
                          <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveGallery(idx); }} className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600">×</button>
                          <div className="p-1 text-xs text-gray-600">{p.name}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button type="button" onClick={(e) => { e.stopPropagation(); galleryInputRef.current && galleryInputRef.current.click(); }} className="text-sm px-2 py-1 rounded border bg-white">Add more</button>
                      <button type="button" onClick={(e) => { e.stopPropagation();
                        // remove newly added previews and files but keep existing ones
                        setGalleryFiles([]);
                        setGalleryPreviews((prev) => prev.filter((p) => p.isExisting));
                        if (galleryInputRef.current) galleryInputRef.current.value = '';
                      }} className="text-sm px-2 py-1 rounded border bg-red-50 text-red-700">Remove new</button>
                    </div>
                  </div>
                )}
              </div>

              {errors.gallery && <p className="mt-1 text-xs text-red-600">{errors.gallery}</p>}
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
              {status === 'saving' ? <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg> : (isEdit ? 'Update' : 'Create')}
            </button>
            <button type="button" onClick={() => {
              if (isEdit) {
                // restore initial values
                setTitle(initial.title || '');
                setSlug(initial.slug || '');
                setExcerpt(initial.excerpt || '');
                setContent(initial.content || '');
                setStatus(null); setErrors({});
                setImage(null);
                setPublished(typeof initial.published !== 'undefined' ? !!initial.published : true);
                if (initial.image) {
                  const base = process.env.NEXT_PUBLIC_API_URL || '';
                  const imageUrl = /^https?:\/\//i.test(initial.image) ? initial.image : `${base}${initial.image.startsWith('/') ? '' : '/'}${initial.image}`;
                  setImagePreview(imageUrl);
                } else {
                  if (imagePreview) { URL.revokeObjectURL(imagePreview); setImagePreview(null); }
                }
                // restore gallery previews from initial
                if (initial.gallery) {
                  let g = initial.gallery;
                  if (!Array.isArray(g)) g = String(g).split(/\s*,\s*/).filter(Boolean);
                  const base = process.env.NEXT_PUBLIC_API_URL || '';
                  const previews = g.map((it) => {
                    const url = /^https?:\/\//i.test(it) ? it : `${base}${it.startsWith('/') ? '' : '/'}${it}`;
                    return { url, name: url.split('/').pop(), size: 0, isExisting: true };
                  });
                  setGalleryPreviews(previews);
                  setGalleryFiles([]);
                } else {
                  // clear gallery previews
                  galleryPreviews.forEach((p) => { if (p && !p.isExisting && p.url) try { URL.revokeObjectURL(p.url); } catch (e) {} });
                  setGalleryPreviews([]);
                  setGalleryFiles([]);
                }
                if (fileInputRef.current) fileInputRef.current.value = '';
              } else {
                setTitle(''); setSlug(''); setExcerpt(''); setContent('');
                setStatus(null); setErrors({}); setImage(null);
                setPublished(true);
                if (imagePreview) { URL.revokeObjectURL(imagePreview); setImagePreview(null); }
                // clear gallery previews and revoke generated urls
                galleryPreviews.forEach((p) => { if (p && !p.isExisting && p.url) try { URL.revokeObjectURL(p.url); } catch (e) {} });
                setGalleryPreviews([]);
                setGalleryFiles([]);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }
            }} className="px-3 py-2 rounded-md border bg-white text-sm">{isEdit ? 'Cancel' : 'Reset'}</button>
          </div>



          <Toast ref={toast} />
        </form>
      </div>
    </div>
  );
}
