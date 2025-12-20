import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const base = process.env.NEXT_PUBLIC_API_URL;

    if (!base) {
      console.error('Missing NEXT_PUBLIC_API_URL');
      return NextResponse.json({ message: 'Server configuration error: NEXT_PUBLIC_API_URL not set' }, { status: 500 });
    }

    const res = await fetch(`${base}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ message: data.message || 'Login failed' }, { status: res.status });

    const token = data.token;
    const maxAge = 7 * 24 * 60 * 60; // 7 days

    const response = NextResponse.json({ user: data.user, token }, { status: 200 });
    response.cookies.set('token', token, { httpOnly: true, path: '/', sameSite: 'lax', maxAge });

    return response;
  } catch (err) {
    console.error('API login proxy error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
