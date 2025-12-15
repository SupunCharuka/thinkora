import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL;
    const id = params.id;

    // forward cookies from the incoming request
    const cookie = request.headers.get('cookie') || '';
    const tokenMatch = cookie.match(/(?:^|; )token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    headers['Content-Type'] = 'application/json';

    // read body and forward if present (allows fallback id)
    let body = null;
    try { body = await request.json(); } catch (e) { body = null; }

    const res = await fetch(`${base}/api/v1/dashboard/blogs/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Delete proxy error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
