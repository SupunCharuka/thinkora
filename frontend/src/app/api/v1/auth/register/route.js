import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const base = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${base}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ message: data.message || 'Signup failed' }, { status: res.status });

    const token = data.token;
    const maxAge = 7 * 24 * 60 * 60; // 7 days
    const cookie = `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;

    return NextResponse.json({ user: data.user }, { status: 201, headers: { 'Set-Cookie': cookie } });
  } catch (err) {
    console.error('API register proxy error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
