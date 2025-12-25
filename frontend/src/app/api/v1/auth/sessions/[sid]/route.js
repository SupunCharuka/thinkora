import { NextResponse } from 'next/server';

export async function DELETE(request, { params } = {}) {
  try {
    // params may be undefined in some environments; fall back to URL parsing
    let sid = params && params.sid;
    if (!sid) {
      try {
        const url = new URL(request.url);
        const parts = url.pathname.split('/').filter(Boolean);
        sid = parts[parts.length - 1];
      } catch (e) { sid = undefined; }
    }

    if (!sid) return NextResponse.json({ message: 'Session id required' }, { status: 400 });

    const base = process.env.NEXT_PUBLIC_API_URL;
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|; )token=([^;]+)/);
    const token = match ? match[1] : null;

    const res = await fetch(`${base}/api/v1/auth/sessions/${encodeURIComponent(sid)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('API sessions DELETE proxy error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
