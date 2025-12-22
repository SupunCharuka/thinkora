"use client";
import React, { useEffect, useState, useRef } from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

function formatDate(d) {
  try {
    return new Date(d).toLocaleString();
  } catch (e) {
    return '-';
  }
}

export default function ContactsTable({ refreshKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rows, setRows] = useState(10);
  const [first, setFirst] = useState(0);
  const dt = useRef(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const headers = { Accept: 'application/json' };
      try {
        const token = localStorage.getItem('token');
        if (token) headers.Authorization = `Bearer ${token}`;
      } catch (e) {}

      const res = await fetch('/api/v1/contact', { credentials: 'include', headers });
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text ? `${res.status} ${text}` : `HTTP ${res.status}`);
      }
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch contacts', err);
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [refreshKey]);

  const header = (
    <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between gap-3">
      <div className="flex-1 flex items-center gap-3 w-full">
        <InputText className="w-full sm:w-72" placeholder="Search messages" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} />
        <Button icon="pi pi-refresh" className="p-button-plain" onClick={() => load()} aria-label="Refresh" />
      </div>
      <div className="text-sm text-gray-500">Total: {items.length}</div>
    </div>
  );

  const nameBody = (row) => (
    <div className="flex flex-col">
      <div className="font-medium text-sm">{row.name || '—'}</div>
      <div className="text-xs text-gray-500">{row._id || ''}</div>
    </div>
  );

  const emailBody = (row) => <div className="text-sm text-blue-600">{row.email || '—'}</div>;

  const messageBody = (row) => (
    <div className="text-sm text-gray-700" title={row.message}>
      {row.message && row.message.length > 120 ? `${row.message.slice(0, 120)}…` : row.message}
    </div>
  );

  const createdBody = (row) => <div className="text-sm text-gray-600">{row.createdAt ? formatDate(row.createdAt) : '—'}</div>;

  async function performDelete(id) {
    try {
      setLoading(true);
      const headers = { Accept: 'application/json' };
      try { const token = localStorage.getItem('token'); if (token) headers.Authorization = `Bearer ${token}`; } catch (e) {}
      const res = await fetch(`/api/v1/contact/${encodeURIComponent(id)}`, { method: 'DELETE', credentials: 'include', headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await load();
    } catch (err) {
      console.error('Failed to delete message', err);
      setError('Failed to delete message');
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(id) {
    confirmDialog({
      message: 'Are you sure you want to delete this message?',
      header: 'Confirm delete',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => performDelete(id),
      reject: () => {},
    });
  }

  const actionsBody = (row) => (
    <div className="flex items-center gap-2">
      <Button icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={() => handleDelete(row._id)} aria-label="Delete" />
    </div>
  );

  return (
    <div className="mt-6">
      <div className="p-5 bg-white shadow-lg rounded-lg overflow-hidden">
        <ConfirmDialog />
        <h3 className="text-lg font-semibold mb-2">Contact messages</h3>
        <p className="text-sm text-gray-500 mb-3">Messages sent via the contact form</p>

        <DataTable
          ref={dt}
          value={items}
          header={header}
          paginator
          rows={rows}
          first={first}
          onPage={(e) => { setFirst(e.first); setRows(e.rows); }}
          loading={loading}
          globalFilter={globalFilter}
          globalFilterFields={["name", "email", "message"]}
          responsiveLayout="stack"
          emptyMessage={error || 'No messages found.'}
          className="p-datatable-sm"
        >
          <Column field="name" header="Name" body={nameBody} sortable />
          <Column field="email" header="Email" body={emailBody} sortable />
          <Column field="message" header="Message" body={messageBody} />
          <Column field="createdAt" header="Received" body={createdBody} sortable />
          <Column header="Actions" body={actionsBody} style={{ width: '6rem' }} />
        </DataTable>

        <div className="mt-3 text-sm text-gray-500">Showing {items.length ? Math.min(rows, items.length - first) : 0} of {items.length} messages</div>
      </div>
    </div>
  );
}
