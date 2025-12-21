import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  try {
    // determine id from params or URL
    let id = params && params.id ? params.id : null;
    if (!id) {
      try {
        const url = new URL(request.url);
        const seg = url.pathname.split('/').filter(Boolean);
        const idx = seg.indexOf('blogs');
        if (idx >= 0 && seg.length > idx + 1) id = seg[idx + 1];
      } catch (e) {}
    }
    if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });

    const body = await request.json().catch(() => ({}));
    const base = process.env.NEXT_PUBLIC_API_URL || '';

    // forward cookies and Authorization header from incoming request (to reuse backend cookie-based auth)
    const cookie = request.headers.get('cookie') || '';
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
    const headers = { 'Content-Type': 'application/json' };
    if (authHeader) headers.Authorization = authHeader;
    else {
      const tokenMatch = cookie.match(/(?:^|; )token=([^;]+)/);
      const token = tokenMatch ? tokenMatch[1] : null;
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${base}/api/v1/dashboard/blogs/${encodeURIComponent(id)}/highlight`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Highlight proxy error', err);
    return NextResponse.json({ message: 'Failed to proxy request' }, { status: 500 });
  }
}
