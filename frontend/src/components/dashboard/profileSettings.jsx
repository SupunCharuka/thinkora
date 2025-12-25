"use client";
import React, { useEffect, useState } from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export default function ProfileSettings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [original, setOriginal] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  // password required when changing email
  const [emailPassword, setEmailPassword] = useState('');
  // password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwStatus, setPwStatus] = useState(null);
  // sessions (logged devices)
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmSid, setConfirmSid] = useState(null);
  const [confirmLabel, setConfirmLabel] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setStatus(null);
      try {
        const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null;
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch('/api/v1/auth/profile', { credentials: 'include', headers });
        if (res.ok) {
          const data = await res.json();
          const u = data.user || data;
          if (!mounted) return;
          setName(u.name || '');
          setEmail(u.email || '');
          setBio(u.bio || '');
          setOriginal({ name: u.name || '', email: u.email || '', bio: u.bio || '' });
        } else {
          const raw = localStorage.getItem('user');
          if (raw && mounted) {
            const u = JSON.parse(raw);
            setName(u.name || '');
            setEmail(u.email || '');
            setBio(u.bio || '');
            setOriginal({ name: u.name || '', email: u.email || '', bio: u.bio || '' });
          }
        }
      } catch (err) {
        const raw = localStorage.getItem('user');
        if (raw && mounted) {
          const u = JSON.parse(raw);
          setName(u.name || '');
          setEmail(u.email || '');
          setBio(u.bio || '');
          setOriginal({ name: u.name || '', email: u.email || '', bio: u.bio || '' });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    loadSessions();
    return () => { mounted = false; };
  }, []);

  function parseJwt(token) {
    try {
      const p = token.split('.')[1];
      const json = JSON.parse(atob(p.replace(/-/g, '+').replace(/_/g, '/')));
      return json;
    } catch (e) { return null; }
  }

  async function loadSessions() {
    setSessionsLoading(true);
    setSessionsError(null);
    try {
      const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null;
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch('/api/v1/auth/sessions', { credentials: 'include', headers });
      if (!res.ok) throw new Error((await res.json())?.message || 'Failed to load sessions');
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (err) {
      setSessionsError(err?.message || 'Network error');
    } finally {
      setSessionsLoading(false);
    }
  }

  async function revokeSession(sid) {
    try {
      const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`/api/v1/auth/sessions/${sid}`, { method: 'DELETE', credentials: 'include', headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to revoke session');
      // if revoked current session, clear token and reload
      const payload = parseJwt(token || '') || {};
      if (payload && payload.sid === sid) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        try { window.dispatchEvent(new Event('authChange')); } catch(e){}
        // reload to reflect logged-out state
        window.location.reload();
        return;
      }
      // otherwise refresh list
      loadSessions();
    } catch (err) {
      alert(err?.message || 'Failed to revoke session');
    }
  }

  function validate() {
    const e = {};
    if (!name || !name.toString().trim()) { e.name = 'Name is required'; }
    if (!email || !email.toString().trim()) { e.email = 'Email is required'; }
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { e.email = 'Enter a valid email'; }
    const emailChanged = !original || email !== original.email;
    if (emailChanged && !emailPassword) { e.emailPassword = 'Enter your current password to change email'; }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function save(e) {
    e && e.preventDefault && e.preventDefault();
    setStatus(null);
    setErrors({});
    if (!validate()) return;
    // skip if nothing changed
    const isDirty = !original || name !== original.name || email !== original.email || bio !== original.bio;
    if (!isDirty) { setStatus('No changes to save'); return; }
    setSaving(true);
    setStatus('Saving...');
    try {
      const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const bodyObj = { name: name.trim(), email: email.trim(), bio };
      const emailChanged = !original || email !== original.email;
      if (emailChanged) bodyObj.currentPasswordForEmail = emailPassword;
      const res = await fetch('/api/v1/auth/profile', {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: JSON.stringify(bodyObj),
      });

      const data = await res.json();
      if (!res.ok) {
        // map server validation to field errors when possible
        if (res.status === 409) {
          setErrors({ email: data?.message || 'Email already in use' });
        } else if (res.status === 401) {
          setErrors({ emailPassword: data?.message || 'Current password is incorrect' });
        } else {
          setStatus(data?.message || 'Failed to save profile');
        }
        return;
      }

      try {
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          setOriginal({ name: data.user.name || '', email: data.user.email || '', bio: data.user.bio || '' });
          setEmailPassword('');
        } else {
          const raw = localStorage.getItem('user');
          if (raw) {
            const u = JSON.parse(raw);
            const merged = { ...u, name: name.trim(), email: email.trim(), bio };
            localStorage.setItem('user', JSON.stringify(merged));
            setOriginal({ name: merged.name, email: merged.email, bio: merged.bio });
            setEmailPassword('');
          }
        }
        try { window.dispatchEvent(new Event('authChange')); } catch (e) {}
      } catch (e) { /* ignore */ }

      setStatus(null);
      setSuccessMessage('Profile saved');
      setTimeout(()=>setSuccessMessage(null),3000);
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
    // clear previous password-related field errors
    setErrors(prev=>({ ...prev, currentPassword: undefined, newPassword: undefined, confirmPassword: undefined }));

    const pwErr = {};
    if (!currentPassword) pwErr.currentPassword = 'Current password is required';
    if (!newPassword) pwErr.newPassword = 'New password is required';
    else if (newPassword.length < 6) pwErr.newPassword = 'New password must be at least 6 characters';
    if (newPassword && confirmPassword && newPassword !== confirmPassword) pwErr.confirmPassword = 'Passwords do not match';

    if (Object.keys(pwErr).length) { setErrors(prev=>({ ...prev, ...pwErr })); return; }

    setPwSaving(true);
    try {
      const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch('/api/v1/auth/change-password', {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setErrors(prev=>({ ...prev, currentPassword: data?.message || 'Current password is incorrect' }));
        } else if (res.status === 400) {
          // server-side validation
          setErrors(prev=>({ ...prev, newPassword: data?.message || 'Invalid password' }));
        } else {
          setPwStatus(data?.message || 'Failed to change password');
        }
        return;
      }

      setErrors(prev=>({ ...prev, currentPassword: undefined, newPassword: undefined, confirmPassword: undefined }));
      setPwStatus('Password updated');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setTimeout(()=>setPwStatus(null),3000);
    } catch (err) {
      console.error('Change password error', err);
      setPwStatus(err?.message || 'Network error');
    } finally {
      setPwSaving(false);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;
  // creative two-column layout: left avatar + password, right profile form
  const initials = (name || '').split(' ').map(s => s[0]||'').join('').slice(0,2).toUpperCase() || 'U';
  function pwStrengthLabel(pw) {
    if (!pw) return { score:0, label:'Too short' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const labels = ['Very weak','Weak','Fair','Good','Strong'];
    return { score, label: labels[Math.min(score,4)] };
  }
  const strength = pwStrengthLabel(newPassword);

  return (
    <div className="p-6">
      <div className="grid gap-6 md:grid-cols-3">
        <aside className="md:col-span-1">
          <div className="bg-white p-4 shadow rounded-lg text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">{initials}</div>
            <h3 className="mt-3 text-lg font-semibold text-gray-800">{name || 'Your name'}</h3>
            <p className="text-sm text-gray-500">{email}</p>
            <p className="mt-2 text-sm text-gray-600">{bio || 'Add a short bio to introduce yourself.'}</p>
          </div>

          <div className="mt-4 bg-white p-4 shadow rounded-lg">
            <h4 className="text-sm font-medium text-gray-800">Change password</h4>
            <p className="text-xs text-gray-500 mb-3">Update your password for security.</p>
            <div className="space-y-2">
              <input
                aria-invalid={errors.currentPassword ? true : false}
                type="password"
                value={currentPassword}
                onChange={(e)=>{ setCurrentPassword(e.target.value); setErrors(prev=>({ ...prev, currentPassword: undefined })); }}
                placeholder="Current password"
                className={`mt-2 block w-full rounded-md border px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 ${errors.currentPassword ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'}`}
              />
              {errors.currentPassword && <p className="mt-1 text-xs text-red-600">{errors.currentPassword}</p>}

              <input
                aria-invalid={errors.newPassword ? true : false}
                type="password"
                value={newPassword}
                onChange={(e)=>{ setNewPassword(e.target.value); setErrors(prev=>({ ...prev, newPassword: undefined })); }}
                placeholder="New password"
                className={`mt-2 block w-full rounded-md border px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 ${errors.newPassword ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'}`}
              />
              {errors.newPassword && <p className="mt-1 text-xs text-red-600">{errors.newPassword}</p>}

              <div className="w-full bg-gray-100 h-2 rounded overflow-hidden">
                <div className={`h-2 bg-gradient-to-r from-red-500 to-green-500`} style={{ width: `${(strength.score/4)*100}%` }} />
              </div>
              <div className="text-xs text-gray-600 flex items-center justify-between">
                <span>{strength.label}</span>
                <span className="text-right text-xs text-gray-500">min 6 chars, mix case, numbers, symbols</span>
              </div>

              <input
                aria-invalid={errors.confirmPassword ? true : false}
                type="password"
                value={confirmPassword}
                onChange={(e)=>{ setConfirmPassword(e.target.value); setErrors(prev=>({ ...prev, confirmPassword: undefined })); }}
                placeholder="Confirm new password"
                className={`mt-2 block w-full rounded-md border px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'}`}
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}

              <div className="flex items-center gap-3 mt-2">
                <button onClick={changePassword} className="px-3 py-2 bg-gray-700 text-white rounded-md" disabled={pwSaving}>{pwSaving ? 'Updating…' : 'Change'}</button>
                {pwStatus && <div className="text-sm text-gray-600">{pwStatus}</div>}
              </div>
            </div>
          </div>
        </aside>

        <section className="md:col-span-2">
          <form onSubmit={save} className="bg-white p-6 shadow rounded-lg">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full name</label>
                  <input value={name} onChange={(e)=>{ setName(e.target.value); setErrors(prev=>({ ...prev, name: undefined })); }} className={`mt-2 block w-full rounded-md border px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'}`} placeholder="Your full name" aria-invalid={errors.name ? true : false} aria-describedby={errors.name ? 'error-name' : undefined} />
                  {errors.name && <p id="error-name" className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input value={email} onChange={(e)=>{ setEmail(e.target.value); setErrors(prev=>({ ...prev, email: undefined })); }} className={`mt-2 block w-full rounded-md border px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'}`} placeholder="you@example.com" aria-invalid={errors.email ? true : false} aria-describedby={errors.email ? 'error-email' : undefined} />
                {errors.email && <p id="error-email" className="mt-1 text-xs text-red-600">{errors.email}</p>}
                {(!original || email !== original.email) && (
                  <>
                    <input
                      aria-invalid={errors.emailPassword ? true : false}
                      type="password"
                      value={emailPassword}
                      onChange={(e)=>{ setEmailPassword(e.target.value); setErrors(prev=>({ ...prev, emailPassword: undefined })); }}
                      placeholder="Current password to change email"
                      className={`mt-2 block w-full rounded-md border px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 ${errors.emailPassword ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'}`}
                    />
                    {errors.emailPassword && <p className="mt-1 text-xs text-red-600">{errors.emailPassword}</p>}
                  </>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea value={bio} onChange={(e)=>{ setBio(e.target.value); setErrors(prev=>({ ...prev, bio: undefined })); }} rows={4} className={`mt-2 block w-full rounded-md border px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 ${errors.bio ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'}`} placeholder="Short bio for your profile" aria-invalid={errors.bio ? true : false} aria-describedby={errors.bio ? 'error-bio' : undefined} />
                {errors.bio && <p id="error-bio" className="mt-1 text-xs text-red-600">{errors.bio}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">Profile settings — keep your info up-to-date.</div>
              <div className="flex items-center gap-3">
                <button type="submit" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
              </div>
            </div>
            {status && <div className="mt-3 text-sm text-green-600">{status}</div>}
          </form>
          <div className="mt-4 bg-white p-6 shadow rounded-lg">
            <h4 className="text-sm font-medium text-gray-800">Logged devices</h4>
            <p className="text-xs text-gray-500 mb-3">Active sessions for your account. Revoke any unknown devices.</p>
            {sessionsLoading && <div className="text-sm text-gray-600">Loading...</div>}
            {sessionsError && <div className="text-sm text-red-600">{sessionsError}</div>}
            {!sessionsLoading && sessions && sessions.length === 0 && <div className="text-sm text-gray-600">No active sessions found.</div>}
            <ul className="mt-2 space-y-2">
              {sessions.map(s => (
                <li key={s.sid} className="flex items-center justify-between border p-2 rounded">
                  <div className="text-xs">
                    <div className="font-medium">{s.userAgent || 'Unknown device'}</div>
                    <div className="text-gray-500">{s.ip || ''} • Last seen: {new Date(s.lastSeen).toLocaleString()}</div>
                  </div>
                  <div className="ml-4">
                    <button onClick={()=>{ setConfirmSid(s.sid); setConfirmLabel(s.userAgent || 'Unknown device'); setConfirmOpen(true); }} className="px-3 py-1 bg-red-600 text-white rounded">Sign out</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Dialog header="Sign out device" visible={confirmOpen} style={{ width: '350px' }} onHide={() => setConfirmOpen(false)} footer={(
            <div className="flex gap-2">
              <Button label="Cancel" onClick={() => setConfirmOpen(false)} className="p-button-text" />
              <Button label="Sign out" className="p-button-danger" onClick={() => { setConfirmOpen(false); revokeSession(confirmSid); }} />
            </div>
          )}>
            <p>Are you sure you want to sign out the device: <strong>{confirmLabel}</strong> ?</p>
          </Dialog>
        </section>
      </div>
    </div>
  );
}
