import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL;

    // forward cookies and Authorization header from the incoming request to the backend
    const cookie = request.headers.get('cookie') || '';
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';

    const headers = { 'Content-Type': 'application/json' };
    if (cookie) headers.Cookie = cookie;
    if (authHeader) headers.Authorization = authHeader;

    const res = await fetch(`${base}/api/v1/dashboard`, {
      method: 'GET',
      headers,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Dashboard proxy error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
