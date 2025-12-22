"use client";
import React, { useEffect, useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/dashboard/sidebar';
import Topbar from '@/components/dashboard/topbar';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FilterMatchMode } from 'primereact/api';
import useDashboardAuth from '@/hooks/useDashboardAuth';
import { Toast } from 'primereact/toast';

export default function HeroSelectorPage() {
    const { loading: checking } = useDashboardAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ global: { value: null, matchMode: FilterMatchMode.CONTAINS }, categoryName: { value: null, matchMode: FilterMatchMode.EQUALS } });
    const toast = useRef(null);

    const categoryOptions = useMemo(() => {
        const setCat = new Set((blogs || []).map(b => b.categoryName || 'Uncategorized'));
        return Array.from(setCat).map(c => ({ label: c, value: c }));
    }, [blogs]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null;
            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            const res = await fetch('/api/v1/dashboard/blogs', { credentials: 'include', headers });
            if (!res.ok) throw new Error('Failed to load blogs');
            const data = await res.json();
            // only show public (published) blogs in hero selector
            const publicOnly = (data || []).filter(b => !!b.published);
            setBlogs(publicOnly.map(b => ({ ...b, heroRank: b.heroRank || null, categoryName: b.category?.name || 'Uncategorized' })));
        } catch (err) {
            console.error(err);
            toast.current && toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load blogs', life: 4000 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (!checking) fetchBlogs(); }, [checking]);

    const header = (
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <span className="p-input-icon-left">
                <InputText value={filters.global?.value || ''} onChange={(e) => setFilters(prev => ({ ...prev, global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS } }))} placeholder="Search by title" />
            </span>

            <Dropdown options={categoryOptions} value={filters.categoryName?.value || null} onChange={(e) => setFilters(prev => ({ ...prev, categoryName: { value: e.value, matchMode: FilterMatchMode.EQUALS } }))} placeholder="Category" className="w-48" optionLabel="label" optionValue="value" />

            <Button icon="pi pi-filter-slash" className="p-button-text" onClick={() => setFilters({ global: { value: null, matchMode: FilterMatchMode.CONTAINS }, categoryName: { value: null, matchMode: FilterMatchMode.EQUALS } })} aria-label="Clear filters" />
        </div>
    );

    const assignRank = async (row, rank) => {
        try {
            const id = encodeURIComponent(row._id || row.id || row.slug);
            const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null;
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers.Authorization = `Bearer ${token}`;
            const res = await fetch(`/api/v1/dashboard/blogs/${id}/hero`, {
                method: 'PATCH',
                credentials: 'include',
                headers,
                body: JSON.stringify({ heroRank: rank }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                toast.current && toast.current.show({ severity: 'error', summary: 'Error', detail: err.message || 'Failed to update hero', life: 4000 });
                return;
            }
            const updated = await res.json();
            // refresh local state: clear previous rank and set new
            setBlogs(prev => prev.map(b => (String(b._id || b.id) === String(updated._id || updated.id) ? ({ ...b, heroRank: updated.heroRank || null }) : (b.heroRank === updated.heroRank ? ({ ...b, heroRank: null }) : b))));
            toast.current && toast.current.show({ severity: 'success', summary: 'Updated', detail: rank ? `Assigned slot ${rank}` : 'Cleared hero', life: 3000 });
        } catch (err) {
            console.error(err);
            toast.current && toast.current.show({ severity: 'error', summary: 'Error', detail: 'Network error', life: 4000 });
        }
    };

    const actionsTemplate = (row) => (
        <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(n => (
                <Button key={n} className={`p-button-sm ${row.heroRank === n ? 'p-button-success' : 'p-button-outlined'}`} onClick={() => assignRank(row, row.heroRank === n ? null : n)} label={String(n)} />
            ))}
        </div>
    );

    const createdTemplate = (row) => (
        <div className="text-sm text-gray-600">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'}</div>
    );

    const imageTemplate = (row) => {
        const envBase = (process?.env?.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
        let imageSrc;
        if (!row.image) {
            imageSrc = '/images/placeholder.svg';
        } else if (/^https?:\/\//i.test(row.image)) {
            imageSrc = row.image;
        } else if (row.image.startsWith('/')) {
            // same-origin absolute path -> prefer API host absolute URL when configured
            imageSrc = envBase ? `${envBase}${row.image}` : row.image;
        } else if (envBase) {
            imageSrc = `${envBase}/${row.image}`;
        } else {
            imageSrc = `/${row.image}`;
        }

        return (
            <div className="flex items-center">
                <div className="w-20 h-12 relative rounded overflow-hidden bg-gray-100">
                    <Image src={imageSrc} alt={row.title || 'image'} fill className="object-cover" />
                </div>
            </div>
        );
    };

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
                                            <div className="w-20 h-12 bg-slate-200 rounded animate-pulse" />
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

                    <Toast ref={toast} />
                    <div className="mt-6">
                        
                        <div className="bg-white shadow rounded-md p-5">
                            <h3 className="text-lg font-semibold mb-2">Hero Selector (pick up to 4)</h3>
                            <p className="text-sm text-gray-500 mb-3">Select up to four blogs to feature as heroes on your dashboard.</p>
                            <DataTable value={blogs}
                                paginator
                                rows={10}
                                loading={loading}
                                emptyMessage="No blogs"
                                header={header}
                                filters={filters}
                                onFilter={(e) => setFilters(e.filters)}
                                globalFilterFields={["title", "categoryName"]}
                                responsiveLayout="stack"
                                className="p-datatable-sm"
                            >
                                <Column header="Image" body={imageTemplate} style={{ width: '120px' }} className="hidden sm:table-cell" />
                                <Column field="title" header="Title" body={(row) => <div className="font-medium">{row.title}</div>} />
                                <Column field="categoryName" header="Category" body={(row) => row.categoryName || 'Uncategorized'} className="hidden sm:table-cell" />
                                <Column field="createdAt" header="Created" body={createdTemplate} sortable style={{ width: '140px' }} className="hidden md:table-cell" />
                                <Column field="heroRank" header="Slot" body={(row) => row.heroRank ? `#${row.heroRank}` : '-'} style={{ width: '120px' }} sortable className="hidden md:table-cell" />
                                <Column header="Assign" body={actionsTemplate} style={{ width: '220px' }} />
                            </DataTable>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
