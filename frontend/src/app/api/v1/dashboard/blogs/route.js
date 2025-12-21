import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL;

    // forward cookies and Authorization header from the incoming request
    const cookie = request.headers.get('cookie') || '';
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';

    // prefer an explicit Authorization header, fallback to cookie token
    const headers = { 'Content-Type': 'application/json' };
    if (authHeader) headers.Authorization = authHeader;
    else {
      const match = cookie.match(/(?:^|; )token=([^;]+)/);
      const token = match ? match[1] : null;
      if (token) headers.Authorization = `Bearer ${token}`;
    }

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
