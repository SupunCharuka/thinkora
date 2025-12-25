import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL;
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|; )token=([^;]+)/);
    const token = match ? match[1] : null;

    const res = await fetch(`${base}/api/v1/auth/sessions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('API sessions GET proxy error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
