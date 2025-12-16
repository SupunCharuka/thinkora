"use client";
import React, { useEffect, useState } from 'react';

export default function ProfileSettings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  // password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwStatus, setPwStatus] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setStatus(null);
      try {
        const res = await fetch('/api/v1/auth/profile');
        if (res.ok) {
          const data = await res.json();
          const u = data.user || data;
          if (!mounted) return;
          setName(u.name || '');
          setEmail(u.email || '');
          setBio(u.bio || '');
        } else {
          const raw = localStorage.getItem('user');
          if (raw && mounted) {
            const u = JSON.parse(raw);
            setName(u.name || '');
            setEmail(u.email || '');
            setBio(u.bio || '');
          }
        }
      } catch (err) {
        const raw = localStorage.getItem('user');
        if (raw && mounted) {
          const u = JSON.parse(raw);
          setName(u.name || '');
          setEmail(u.email || '');
          setBio(u.bio || '');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  function validate() {
    if (!name || !name.toString().trim()) { setStatus('Name is required'); return false; }
    if (!email || !email.toString().trim()) { setStatus('Email is required'); return false; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setStatus('Enter a valid email'); return false; }
    return true;
  }

  async function save(e) {
    e && e.preventDefault && e.preventDefault();
    setStatus(null);
    if (!validate()) return;
    setSaving(true);
    setStatus('Saving...');
    try {
      const res = await fetch('/api/v1/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), bio }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus(data?.message || 'Failed to save profile');
        return;
      }

      try {
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          const raw = localStorage.getItem('user');
          if (raw) {
            const u = JSON.parse(raw);
            const merged = { ...u, name: name.trim(), email: email.trim(), bio };
            localStorage.setItem('user', JSON.stringify(merged));
          }
        }
        try { window.dispatchEvent(new Event('authChange')); } catch (e) {}
      } catch (e) { /* ignore */ }

      setStatus('Saved');
    } catch (err) {
      console.error('Save profile error', err);
      setStatus(err?.message || 'Network error');
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(e) {
    e && e.preventDefault && e.preventDefault();
    setPwStatus(null);
    if (!currentPassword || !newPassword) { setPwStatus('Both fields are required'); return; }
    if (newPassword.length < 6) { setPwStatus('New password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setPwStatus('Passwords do not match'); return; }
    setPwSaving(true);
    try {
      const res = await fetch('/api/v1/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwStatus(data?.message || 'Failed to change password');
        return;
      }
      setPwStatus('Password updated');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      console.error('Change password error', err);
      setPwStatus(err?.message || 'Network error');
    } finally {
      setPwSaving(false);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <form onSubmit={save} className="p-6">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
            rows={4}
            placeholder="Short bio for your profile"
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-800">Change password</h3>
          <p className="text-xs text-gray-500 mb-2">Leave blank to keep your current password.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
              placeholder="Current password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
              placeholder="New password (min 6 chars)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm new password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
              placeholder="Confirm new password"
            />
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button type="button" onClick={changePassword} className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700" disabled={pwSaving}>
              {pwSaving ? 'Updating…' : 'Change password'}
            </button>
            {pwStatus && <div className="text-sm text-gray-600">{pwStatus}</div>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700" disabled={saving}>
            {saving ? 'Saving…' : 'Save profile'}
          </button>
          {status && <div className="text-sm text-gray-600">{status}</div>}
        </div>
      </div>
    </form>
  );
}
