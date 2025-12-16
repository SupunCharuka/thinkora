import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL;

    // forward cookies from the incoming request
    const cookie = request.headers.get('cookie') || '';

    // Extract token from cookie string (token=...)
    const match = cookie.match(/(?:^|; )token=([^;]+)/);
    const token = match ? match[1] : null;

    const res = await fetch(`${base}/api/v1/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('API profile GET proxy error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const base = process.env.NEXT_PUBLIC_API_URL;

    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|; )token=([^;]+)/);
    const token = match ? match[1] : null;

    const res = await fetch(`${base}/api/v1/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('API profile PUT proxy error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
