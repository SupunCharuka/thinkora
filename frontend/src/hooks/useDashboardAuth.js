"use client";
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function useDashboardAuth(options = {}) {
  const { redirect = true } = options;
  const router = useRouter();
  const [data, setData] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(
    async (signal) => {
      setLoading(true);
      setError(null);
      try {
        // Attach Authorization header from localStorage when present (client-side)
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        // If there's no client token, avoid calling the dashboard endpoint from public pages
        // (prevents a visible 401 in the network console on pages like the login page).
        if (!token) {
          setData(null);
          setLoading(false);
          // If we should redirect when unauthenticated, do so.
          if (redirect) router.push('/login');
          return;
        }

        const headers = { Accept: 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch('/api/v1/dashboard', {
          method: 'GET',
          credentials: 'include',
          headers,
          signal,
        });

        if (res.status === 401 || res.status === 403) {
          let json = null;
          try {
            json = await res.json();
          } catch (e) {
            // ignore parse errors
          }
          const msg = json?.message || 'Authentication required';
          setError(msg);
          if (redirect) router.push('/login');
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          setError(text || `Unexpected response: ${res.status}`);
          return;
        }

        const json = await res.json();
        setData(json);
        setMessage(json?.message ?? JSON.stringify(json));
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('useDashboardAuth load error', err);
        setError(err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    },
    [router, redirect]
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const reload = useCallback(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return { data, message, loading, error, reload };
}
