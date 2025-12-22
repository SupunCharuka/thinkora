"use client";
import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";
import Link from 'next/link';
import Image from 'next/image';
import useDashboardAuth from '@/hooks/useDashboardAuth';
// PrimeReact imports
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FilterMatchMode } from 'primereact/api';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

export default function ViewBlogsPage() {
    const { loading: checking, data } = useDashboardAuth();
    const [blogs, setBlogs] = useState([]);
    const [loadingBlogs, setLoadingBlogs] = useState(false);
    const [error, setError] = useState(null);
    const toast = React.useRef(null);
    const [rowsPerPage, setRowsPerPage] = useState(9);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        categoryName: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const fetchBlogs = async (signal) => {
        setLoadingBlogs(true);
        setError(null);
        try {
            const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null;
            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            const res = await fetch('/api/v1/dashboard/blogs', { credentials: 'include', headers });
            if (!res.ok) throw new Error(`Failed to load blogs (${res.status})`);
            const all = await res.json();
            if (signal && signal.aborted) return;
            const userId = String(data.userId);
            const mine = (all || []).filter(b => {
                const authorId = b?.author?._id || b?.author || null;
                return authorId && String(authorId) === userId;
            }).map(b => ({
                ...b,
                // normalize category name and a numeric timestamp for reliable sorting
                categoryName: b?.category?.name || b?.category || 'Uncategorized',
                createdTimestamp: b?.createdAt ? new Date(b.createdAt).getTime() : 0,
                published: b?.published === undefined ? true : !!b.published
            }));
            setBlogs(mine);
        } catch (err) {
            setError(err.message || 'Failed to load blogs');
        } finally {
            setLoadingBlogs(false);
        }
    };

    useEffect(() => {
        if (checking) return;
        if (!data || !data.userId) {
            setBlogs([]);
            return;
        }

        const controller = new AbortController();
        fetchBlogs(controller.signal);
        return () => controller.abort();
    }, [checking, data]);

    // adjust rows per page based on window width for responsiveness
    useEffect(() => {
        const updateRows = () => {
            try {
                const w = window.innerWidth;
                setRowsPerPage(w < 640 ? 5 : 9);
            } catch (e) { }
        };
        updateRows();
        window.addEventListener('resize', updateRows);
        return () => window.removeEventListener('resize', updateRows);
    }, []);

    // categories for dropdown filter
    const categoryOptions = useMemo(() => {
        const setCat = new Set((blogs || []).map(b => b.categoryName || 'Uncategorized'));
        return Array.from(setCat).map(c => ({ label: c, value: c }));
    }, [blogs]);

    // visibility options for dropdown filter
    const visibilityOptions = useMemo(() => (
        [
            { label: 'All', value: 'all' },
            { label: 'Public', value: true },
            { label: 'Private', value: false }
        ]
    ), [blogs]);

    // creative UI helpers
    const getCategoryColor = (name) => {
        if (!name) return 'bg-gray-200 text-gray-800';
        const key = String(name).toLowerCase();
        if (key.includes('tech')) return 'bg-blue-100 text-blue-800';
        if (key.includes('news')) return 'bg-green-100 text-green-800';
        if (key.includes('life')) return 'bg-pink-100 text-pink-800';
        if (key === 'uncategorized') return 'bg-yellow-100 text-yellow-800';
        return 'bg-indigo-100 text-indigo-800';
    };

    const titleTemplate = (row) => (
        <div className="flex flex-col">
            <Link href={`/blogs/${row.slug}`} className="text-gray-900 hover:text-blue-600 font-semibold line-clamp-2">{row.title}</Link>
            {row.excerpt && <span className="text-sm text-gray-500 mt-1 line-clamp-2">{row.excerpt}</span>}
        </div>
    );

    const categoryTemplate = (row) => (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor((row.categoryName || '').toString())}`}>
            <span className="w-2 h-2 rounded-full bg-black inline-block opacity-70" />
            {row.categoryName}
        </span>
    );

    const visibilityTemplate = (row) => (
        <div className="text-sm">
            {row.published ? (
                <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Public</span>
            ) : (
                <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Private</span>
            )}
        </div>
    );

    const createdTemplate = (row) => (
        <div className="text-sm text-gray-600">{new Date(row.createdTimestamp).toLocaleDateString()}</div>
    );

    const actionTemplate = (row) => (
        <div className="flex items-center gap-2">
            <Link href={`/blogs/${row.slug}`} className="">
                <Button icon="pi pi-eye" className="p-button-sm p-button-plain" aria-label={`View ${row.title}`} />
            </Link>
            <Link href={`/dashboard/create-blog?edit=${row._id || row.slug}`}>
                <Button icon="pi pi-pencil" className="p-button-sm p-button-help" aria-label={`Edit ${row.title}`} />
            </Link>
            <Button icon={row.published ? 'pi pi-lock-open' : 'pi pi-lock'} className="p-button-sm p-button-secondary" aria-label={`Toggle visibility ${row.title}`} onClick={() => {
                const id = row._id || row.id || row.slug;
                if (!id || String(id) === 'undefined') { console.error('Toggle aborted: invalid id', id, row); return; }
                confirmDialog({
                    message: `${row.published ? 'Make this blog private?' : 'Make this blog public?'}`,
                    header: 'Confirm',
                    icon: 'pi pi-exclamation-triangle',
                    acceptClassName: 'p-button-danger',
                    accept: async () => {
                        try {
                            const urlId = encodeURIComponent(String(id));
                            const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null;
                            const headers = { 'Content-Type': 'application/json' };
                            if (token) headers.Authorization = `Bearer ${token}`;
                            const res = await fetch(`/api/v1/dashboard/blogs/${urlId}/publish`, {
                                method: 'PATCH',
                                credentials: 'include',
                                headers,
                                body: JSON.stringify({ published: !row.published, id }),
                            });
                            if (!res.ok) {
                                const err = await res.json().catch(() => ({}));
                                toast.current && toast.current.show({ severity: 'error', summary: 'Error', detail: err.message || 'Failed to toggle visibility', life: 4000 });
                                return;
                            }
                            const updated = await res.json();
                            setBlogs(prev => prev.map(b => (String(b._id || b.id) === String(updated._id || updated.id) ? ({ ...b, published: !!updated.published }) : b)));
                            toast.current && toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Visibility updated', life: 3000 });
                        } catch (err) {
                            console.error('Toggle error', err);
                            toast.current && toast.current.show({ severity: 'error', summary: 'Error', detail: 'Network error', life: 4000 });
                        }
                    }
                });
            }} />
            <Button icon="pi pi-trash" className="p-button-sm p-button-danger" aria-label={`Delete ${row.title}`} onClick={() => {
                const id = row._id || row.id || row.slug;
                if (!id || String(id) === 'undefined') { console.error('Invalid id for delete', id); return; }
                confirmDialog({
                    message: `Delete blog "${row.title}"? This cannot be undone.`,
                    header: 'Confirm Delete',
                    icon: 'pi pi-exclamation-triangle',
                    acceptClassName: 'p-button-danger',
                    accept: async () => {
                        try {
                            const urlId = encodeURIComponent(String(id));
                            const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null;
                            const headers = { 'Content-Type': 'application/json' };
                            if (token) headers.Authorization = `Bearer ${token}`;
                            const res = await fetch(`/api/v1/dashboard/blogs/${urlId}`, {
                                method: 'DELETE',
                                credentials: 'include',
                                headers,
                                body: JSON.stringify({ id }),
                            });
                            if (!res.ok) {
                                const err = await res.json().catch(() => ({}));
                                toast.current && toast.current.show({ severity: 'error', summary: 'Error', detail: err.message || 'Failed to delete blog', life: 4000 });
                                return;
                            }
                            setBlogs(prev => prev.filter(b => String(b._id || b.id) !== String(id)));
                            toast.current && toast.current.show({ severity: 'success', summary: 'Deleted', detail: 'Blog deleted', life: 3000 });
                        } catch (err) {
                            console.error('Delete error', err);
                            toast.current && toast.current.show({ severity: 'error', summary: 'Error', detail: 'Network error', life: 4000 });
                        }
                    }
                });
            }} />
            <Button icon="pi pi-star" className={`p-button-sm ${row.highlighted ? 'p-button-warning' : 'p-button-outlined'}`} aria-label={`Highlight ${row.title}`} onClick={async () => {
                const id = row._id || row.id || row.slug;
                if (!id || String(id) === 'undefined') { console.error('Invalid id for highlight', id); return; }
                try {
                    const urlId = encodeURIComponent(String(id));
                    const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null;
                    const headers = { 'Content-Type': 'application/json' };
                    if (token) headers.Authorization = `Bearer ${token}`;
                    const res = await fetch(`/api/v1/dashboard/blogs/${urlId}/highlight`, {
                        method: 'PATCH',
                        credentials: 'include',
                        headers,
                        body: JSON.stringify({ highlighted: !row.highlighted }),
                    });
                    if (!res.ok) {
                        const err = await res.json().catch(() => ({}));
                        toast.current && toast.current.show({ severity: 'error', summary: 'Error', detail: err.message || 'Failed to toggle highlight', life: 4000 });
                        return;
                    }
                    const updated = await res.json();
                    setBlogs(prev => prev.map(b => (String(b._id || b.id) === String(updated._id || updated.id) ? ({ ...b, highlighted: !!updated.highlighted }) : b)));
                    toast.current && toast.current.show({ severity: 'success', summary: 'Updated', detail: updated.highlighted ? 'Blog highlighted' : 'Highlight removed', life: 3000 });
                } catch (err) {
                    console.error('Highlight error', err);
                    toast.current && toast.current.show({ severity: 'error', summary: 'Error', detail: 'Network error', life: 4000 });
                }
            }} />
        </div>
    );

    const header = (
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <span className="p-input-icon-left">
                <InputText value={filters.global?.value || ''} onChange={(e) => {
                    const val = e.target.value;
                    setFilters(prev => ({ ...prev, global: { value: val, matchMode: FilterMatchMode.CONTAINS } }));
                }} placeholder="Search by title" />
            </span>

            <Dropdown options={categoryOptions} value={filters.categoryName?.value || null} onChange={(e) => {
                const val = e.value;
                setFilters(prev => ({ ...prev, categoryName: { value: val, matchMode: FilterMatchMode.EQUALS } }));
            }} placeholder="Filter by category" className="w-48" />

            <Dropdown options={visibilityOptions} value={typeof filters.published !== 'undefined' ? filters.published.value : 'all'} onChange={(e) => {
                const val = e.value;
                setFilters(prev => {
                    const next = { ...prev };
                    if (val === 'all') {
                        // clear the published filter to show all
                        delete next.published;
                    } else {
                        next.published = { value: val, matchMode: FilterMatchMode.EQUALS };
                    }
                    return next;
                });
            }} placeholder="Visibility" className="w-36" optionLabel="label" optionValue="value" />

            <Button icon="pi pi-filter-slash" className="p-button-text" onClick={() => setFilters({ global: { value: null, matchMode: FilterMatchMode.CONTAINS }, categoryName: { value: null, matchMode: FilterMatchMode.EQUALS } })} aria-label="Clear filters" />
        </div>
    );

    if (checking) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="flex">
                    <aside className="w-64 hidden md:block p-6">
                        <div className="space-y-4">
                            <div className="h-6 bg-slate-200 rounded w-2/3 animate-pulse" />
                            <div className="h-10 bg-slate-200 rounded animate-pulse" />
                            <div className="h-10 bg-slate-200 rounded animate-pulse" />
                            <div className="h-10 bg-slate-200 rounded animate-pulse" />
                        </div>
                    </aside>

                    <main className="flex-1 p-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="h-8 bg-slate-200 rounded w-1/3 mb-6 animate-pulse" />

                            <div className="bg-white shadow rounded-md p-4">
                                <div className="space-y-3">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3">
                                            <div className="w-12 h-9 bg-slate-200 rounded animate-pulse" />
                                            <div className="flex-1">
                                                <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
                                                <div className="h-3 bg-slate-200 rounded w-1/2 mt-2 animate-pulse" />
                                            </div>
                                            <div className="w-28 h-6 bg-slate-200 rounded animate-pulse" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <div className="flex">

                <main className="flex-1 p-6">

                    <ConfirmDialog />
                    <Toast ref={toast} />
                    <div className="mt-6">
                        <div className="bg-white shadow rounded-md p-5">
                            <h3 className="text-lg font-semibold mb-2">My Blogs</h3>
                            <p className="text-sm text-gray-500 mb-3">List of blogs you have created</p>
                            {loadingBlogs ? (
                                <div className="space-y-3">
                                    {Array.from({ length: rowsPerPage || 6 }).map((_, i) => (
                                        <div key={`skeleton-row-${i}`} className="flex items-center gap-4 p-3">
                                            <div className="w-12 h-9 bg-slate-200 rounded animate-pulse" />
                                            <div className="flex-1">
                                                <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
                                                <div className="h-3 bg-slate-200 rounded w-1/2 mt-2 animate-pulse" />
                                            </div>
                                            <div className="w-28 h-6 bg-slate-200 rounded animate-pulse" />
                                        </div>
                                    ))}
                                </div>
                            ) : error ? (
                                <p className="text-red-600">{error}</p>
                            ) : blogs.length === 0 ? (
                                <p>No blogs found for your account.</p>
                            ) : (
                                <div>
                                    {/* DataTable implementation using PrimeReact */}
                                    <DataTable value={blogs}
                                        paginator
                                        rows={rowsPerPage}
                                        emptyMessage="No blogs"
                                        responsiveLayout="stack"
                                        className="p-datatable-sm rounded-lg overflow-hidden shadow-sm"
                                        header={header}
                                        filters={filters}
                                        onFilter={(e) => setFilters(e.filters)}
                                        globalFilterFields={["title"]}
                                        rowClassName={() => 'hover:bg-gray-50 transition-colors'}
                                    >
                                        <Column header="Image" body={(row) => {
                                            const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
                                            // If the image path is a local absolute path (starts with '/'),
                                            // use it as a same-origin URL so the Next dev server can
                                            // proxy it (see next.config.mjs rewrites). This avoids
                                            // Next's private-IP blocking when optimizing images from localhost.
                                            const image = row.image
                                                ? (/^https?:\/\//i.test(row.image)
                                                    ? row.image
                                                    : (row.image.startsWith('/') ? row.image : `${baseUrl}${row.image.startsWith('/') ? '' : '/'}${row.image}`))
                                                : '/images/placeholder.svg';
                                            return (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-9 sm:w-16 sm:h-12 relative rounded overflow-hidden bg-gray-100">
                                                        <Image src={image} alt={row.title} fill className="object-cover" />
                                                    </div>
                                                </div>
                                            );
                                        }} style={{ width: '120px' }} />

                                        <Column field="title" header="Title" body={titleTemplate} sortable />

                                        <Column field="categoryName" header="Category" body={categoryTemplate} sortable />

                                        <Column field="createdTimestamp" header="Created" body={createdTemplate} sortable style={{ width: '140px' }} />

                                        <Column field="published" header="Visibility" body={visibilityTemplate} style={{ width: '120px' }} />

                                        <Column field="views" header="Views" sortable style={{ width: '100px' }} body={(row) => (
                                            <div className="text-sm text-gray-700">{typeof row.views === 'number' ? row.views : 0}</div>
                                        )} />

                                        <Column header="Actions" body={actionTemplate} style={{ width: '140px' }} />
                                    </DataTable>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}