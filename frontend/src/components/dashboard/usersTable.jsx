"use client";
import React, { useEffect, useState, useRef } from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

function formatDate(d) {
  try {
    return new Date(d).toLocaleString();
  } catch (e) {
    return '-';
  }
}

export default function UsersTable({ refreshKey }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rows, setRows] = useState(10);
  const [first, setFirst] = useState(0);
  const dt = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const headers = { Accept: 'application/json' };
      try {
        const token = localStorage.getItem('token');
        if (token) headers.Authorization = `Bearer ${token}`;
      } catch (e) {
        // ignore localStorage errors in SSR contexts
      }
      // Call the local Next.js API route which proxies to the backend
      const res = await fetch('/api/v1/users', { credentials: 'include', headers });
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text ? `${res.status} ${text}` : `HTTP ${res.status}`);
      }
      const data = await res.json();
      setUsers(Array.isArray(data.users) ? data.users : data.users || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [refreshKey]);

  useEffect(() => {
    const update = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
      setIsMobile(w < 640);
      setRows(w < 640 ? 5 : 10);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const header = (
    <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between gap-3">
      <div className="flex-1 flex items-center gap-3 w-full">
        <InputText className="w-full sm:w-72" placeholder="Search users" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} />
        <Button icon="pi pi-refresh" className="p-button-plain" onClick={() => load()} aria-label="Refresh" />
      </div>
      <div className="text-sm text-gray-500">Total: {users.length}</div>
    </div>
  );

  const nameBody = (row) => (
    <div className="flex flex-col">
      <div className="font-medium text-sm">{row.name || '—'}</div>
      <div className="text-xs text-gray-500">{row._id || ''}</div>
    </div>
  );

  const createdBody = (row) => <div className="text-sm text-gray-600">{row.createdAt ? formatDate(row.createdAt) : '—'}</div>;

  return (
    <div className="mt-6 max-w">
      <div className="p-5 bg-white shadow-lg rounded-lg overflow-hidden">
        <h3 className="text-lg font-semibold mb-2">Users</h3>
        <p className="text-sm text-gray-500 mb-3">List of registered users</p>

        <DataTable
          ref={dt}
          value={users}
          header={header}
          paginator
          rows={rows}
          first={first}
          onPage={(e) => { setFirst(e.first); setRows(e.rows); }}
          loading={loading}
          globalFilter={globalFilter}
          globalFilterFields={["name","email","bio"]}
          responsiveLayout="stack"
          emptyMessage={error || 'No users found.'}
          className="p-datatable-sm"
        >
          <Column field="name" header="Name" body={nameBody} sortable />
          <Column field="email" header="Email" sortable />
          <Column field="bio" header="Bio" />
          <Column field="createdAt" header="Joined" body={createdBody} sortable />
        </DataTable>

        <div className="mt-3 text-sm text-gray-500">Showing {users.length ? Math.min(rows, users.length - first) : 0} of {users.length} users</div>
      </div>
    </div>
  );
}
