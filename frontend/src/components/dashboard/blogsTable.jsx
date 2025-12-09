import React, { useMemo, useState } from "react";

const sampleProducts = [
    { id: 1, name: 'Apple MacBook Pro 17"', color: 'Silver', category: 'Laptop', price: '$2999', meta: 'MacBook • 2021' },
    { id: 2, name: 'Microsoft Surface Pro', color: 'White', category: 'Laptop PC', price: '$1999', meta: 'Surface • 2022' },
    { id: 3, name: 'Magic Mouse 2', color: 'Black', category: 'Accessories', price: '$99', meta: 'Apple • Accessory' },
    { id: 4, name: 'Apple Watch', color: 'Silver', category: 'Accessories', price: '$179', meta: 'Watch • 2023' },
    { id: 5, name: 'iPad', color: 'Gold', category: 'Tablet', price: '$699', meta: 'iPad • 2021' },
    { id: 6, name: 'Apple iMac 27"', color: 'Silver', category: 'PC Desktop', price: '$3999', meta: 'iMac • Studio' },
];

function initials(name) {
    return name.split(' ').slice(0,2).map(s => s[0]).join('').toUpperCase();
}

export default function blogsTable() {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const filtered = useMemo(() => {
        if (!query) return sampleProducts;
        const q = query.toLowerCase();
        return sampleProducts.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }, [query]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageProducts = filtered.slice((page-1)*pageSize, page*pageSize);

    return (
        <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-lg border border-default">
            <div className="p-4 flex items-center justify-between gap-4">
                <label htmlFor="input-group-1" className="sr-only">Search</label>
                <div className="relative flex-1 max-w-xl">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input value={query} onChange={e=>{setQuery(e.target.value); setPage(1);}} type="text" id="input-group-1" className="block w-full ps-9 pe-3 py-2 bg-white border border-default-medium text-heading text-sm rounded-lg focus:ring-brand focus:border-brand shadow-sm" placeholder="Search products or categories" />
                </div>
                <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm hover:opacity-95">New blog</button>
                    <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="shrink-0 inline-flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading shadow-sm font-medium leading-5 rounded-md text-sm px-3 py-2 focus:outline-none" type="button">
                        <svg className="w-4 h-4 me-1.5 -ms-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z" />
                        </svg>
                        Filter
                    </button>
                </div>
            </div>

            {/* Mobile: stacked cards */}
            <div className="sm:hidden px-4">
                {pageProducts.map(p => (
                    <div key={p.id} className="mb-3 bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-md flex items-center justify-center text-white font-semibold text-sm" style={{background: `linear-gradient(135deg,#7c3aed,#06b6d4)`}}>{initials(p.name)}</div>
                                <div>
                                    <div className="text-heading font-medium">{p.name}</div>
                                    <div className="text-xs text-body">{p.meta}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-semibold">{p.price}</div>
                                <div className="text-xs text-body">{p.category}</div>
                            </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                            <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-default-medium rounded-md text-sm hover:bg-neutral-secondary-medium">Edit</button>
                            <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop / tablet: table */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm text-left rtl:text-right text-body border-separate" style={{borderSpacing:0}}>
                    <thead>
                        <tr className="bg-gradient-to-r from-white/60 to-white/40">
                            <th className="px-6 py-3 font-medium sticky top-0 bg-neutral-secondary-medium">Product</th>
                            <th className="hidden sm:table-cell px-6 py-3 font-medium">Color</th>
                            <th className="hidden sm:table-cell px-6 py-3 font-medium">Category</th>
                            <th className="hidden sm:table-cell px-6 py-3 font-medium">Price</th>
                            <th className="px-6 py-3 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageProducts.map((p, idx) => (
                            <tr key={p.id} className={`transition-transform duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-primary-soft'} hover:shadow-md`}> 
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-md flex items-center justify-center text-white font-semibold text-sm" style={{background: `linear-gradient(135deg,#7c3aed,#06b6d4)`}}>{initials(p.name)}</div>
                                        <div>
                                            <div className="text-heading font-medium">{p.name}</div>
                                            <div className="text-xs text-body">{p.meta}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="hidden sm:table-cell px-6 py-4">{p.color}</td>
                                <td className="hidden sm:table-cell px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-neutral-secondary-medium text-body">{p.category}</span>
                                </td>
                                <td className="hidden sm:table-cell px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-1 text-sm rounded-md bg-gradient-to-r from-green-100 to-green-50 text-heading font-medium">{p.price}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-default-medium rounded-md text-sm hover:bg-neutral-secondary-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"/></svg>
                                            Edit
                                        </button>
                                        <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"/></svg>
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 flex items-center justify-between">
                <div className="text-sm text-body">Showing {(page-1)*pageSize + 1}–{Math.min(page*pageSize, filtered.length)} of {filtered.length} results</div>
                <nav className="inline-flex items-center gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="px-3 py-1 rounded-md bg-neutral-secondary-medium text-sm">Prev</button>
                    {Array.from({length: totalPages}).map((_, i) => (
                        <button key={i} onClick={() => setPage(i+1)} className={`px-3 py-1 rounded-md text-sm ${page===i+1 ? 'bg-indigo-600 text-white' : 'bg-white border border-default-medium'}`}>{i+1}</button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} className="px-3 py-1 rounded-md bg-neutral-secondary-medium text-sm">Next</button>
                </nav>
            </div>
        </div>
    );
}
