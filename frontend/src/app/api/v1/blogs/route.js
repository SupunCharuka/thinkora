import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL;
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|; )token=([^;]+)/);
    const token = match ? match[1] : null;

    // Read incoming body as JSON (or text) and forward as-is
    const body = await request.text();

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${base}/api/v1/blogs`, {
      method: 'POST',
      headers,
      body,
    });

    const data = await res.text();
    // try to parse JSON, otherwise return text
    try {
      return NextResponse.json(JSON.parse(data), { status: res.status });
    } catch (e) {
      return new NextResponse(data, { status: res.status });
    }
  } catch (err) {
    console.error('Blogs proxy error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
