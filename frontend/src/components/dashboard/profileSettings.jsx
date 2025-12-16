"use client";
import React, { useEffect, useState } from "react";
import useDashboardAuth from '@/hooks/useDashboardAuth';

export default function ProfileSettings() {
  const { data } = useDashboardAuth({ redirect: false });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("profile") || "null");
      if (stored) {
        setName(stored.name || "");
        setEmail(stored.email || "");
        setBio(stored.bio || "");
        return;
      }
    } catch (e) {
      // ignore
    }

    if (data?.user) {
      setName(data.user.name || "");
      setEmail(data.user.email || "");
      setBio(data.user.bio || "");
    }
  }, [data]);

  const save = async (e) => {
    e.preventDefault();
    const profile = { name, email, bio };
    try {
      localStorage.setItem("profile", JSON.stringify(profile));
      setStatus("Saved locally");

      // Try backend save but it's optional; failure is non-fatal
      try {
        const res = await fetch('/api/v1/auth/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile),
        });
        if (res.ok) setStatus('Saved to backend');
        else setStatus('Saved locally (backend responded with error)');
      } catch (err) {
        // backend not available — keep local save
      }
    } catch (err) {
      setStatus('Save failed: ' + (err.message || 'unknown'));
    }
  };

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

        <div className="flex items-center gap-3">
          <button type="submit" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Save profile
          </button>
          {status && <div className="text-sm text-gray-600">{status}</div>}
        </div>
      </div>
    </form>
  );
}
