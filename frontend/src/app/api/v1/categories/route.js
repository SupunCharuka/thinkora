import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${base}/api/v1/categories`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Categories proxy GET error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL;

    // forward cookies from the incoming request
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|; )token=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    const res = await fetch(`${base}/api/v1/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Categories proxy POST error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
