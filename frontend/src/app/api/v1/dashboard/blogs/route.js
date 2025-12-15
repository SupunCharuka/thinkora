import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL;

    // forward cookies from the incoming request
    const cookie = request.headers.get('cookie') || '';

    // Extract token from cookie string (token=...)
    const match = cookie.match(/(?:^|; )token=([^;]+)/);
    const token = match ? match[1] : null;

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${base}/api/v1/dashboard/blogs`, {
      method: 'GET',
      headers,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Dashboard blogs proxy error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
