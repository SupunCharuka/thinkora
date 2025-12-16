import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    const body = await request.json();
    const base = process.env.NEXT_PUBLIC_API_URL;

    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|; )token=([^;]+)/);
    const token = match ? match[1] : null;

    const res = await fetch(`${base}/api/v1/auth/change-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('API change-password proxy error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
