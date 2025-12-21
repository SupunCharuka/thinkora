import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL;
    const id = params.id;

    // forward cookies and Authorization header from the incoming request
    const cookie = request.headers.get('cookie') || '';
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
    const body = await request.json();

    const headers = { 'Content-Type': 'application/json' };
    if (authHeader) headers.Authorization = authHeader;
    else {
      const tokenMatch = cookie.match(/(?:^|; )token=([^;]+)/);
      const token = tokenMatch ? tokenMatch[1] : null;
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${base}/api/v1/dashboard/blogs/${id}/publish`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Publish proxy error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
