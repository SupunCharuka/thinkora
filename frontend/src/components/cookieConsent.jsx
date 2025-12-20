"use client";
import { useEffect, useState } from 'react';

export default function CookieConsent() {
  const [accepted, setAccepted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cookie_consent');
      const cookie = (typeof document !== 'undefined' && document.cookie.match(/(?:^|; )cookie_consent=([^;]+)/))
        ? true
        : false;
      if (stored === '1' || cookie) {
        setAccepted(true);
        setVisible(false);
      } else {
        setVisible(true);
      }
    } catch (e) {
      // ignore storage access errors
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem('cookie_consent', '1');
      // set a non-httpOnly cookie so other client code can read it if needed
      document.cookie = 'cookie_consent=1; path=/; max-age=' + 60 * 60 * 24 * 365 + '; SameSite=Lax';
    } catch (e) {
      // ignore
    }
    setAccepted(true);
    setVisible(false);
  }

  function decline() {
    try {
      localStorage.removeItem('cookie_consent');
      document.cookie = 'cookie_consent=; path=/; max-age=0; SameSite=Lax';
    } catch (e) {}
    setAccepted(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed left-4 right-4 bottom-4 z-50">
      <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur rounded-lg shadow-lg p-4 flex flex-col md:flex-row items-start md:items-center gap-3">
        <div className="flex-1 text-sm text-slate-800">
          This site uses cookies to improve your experience. By continuing you accept our cookie policy.
        </div>

        <div className="flex items-center gap-2">
          <button onClick={decline} className="px-3 py-2 rounded-md border bg-white text-sm">
            Decline
          </button>
          <button onClick={accept} className="px-4 py-2 rounded-md bg-black text-white text-sm">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
