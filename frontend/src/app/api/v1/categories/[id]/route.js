import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL;
    let id = params?.id;

    // Fallback: try to extract id from request URL (some callers may omit params)
    if (!id) {
      try {
        const url = new URL(request.url);
        const parts = url.pathname.split('/').filter(Boolean);
        // expect .../api/v1/categories/<id>
        const last = parts[parts.length - 1];
        if (last && last !== 'categories') id = last;
      } catch (e) {
        // ignore
      }
    }

    // We'll need the body for forwarding; read it once and also use it as a fallback source for id
    const body = await request.json().catch(() => null);
    if (!id && body) {
      id = body.id || body._id || null;
    }

    if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });

    // forward cookies from the incoming request
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|; )token=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const res = await fetch(`${base}/api/v1/categories/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Categories proxy PUT error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL;
    let id = params?.id;

    // try to extract id from URL path
    if (!id) {
      try {
        const url = new URL(request.url);
        const parts = url.pathname.split('/').filter(Boolean);
        const last = parts[parts.length - 1];
        if (last && last !== 'categories') id = last;
      } catch (e) {}
    }

    // also check body (if any)
    const body = await request.json().catch(() => null);
    if (!id && body) id = body.id || body._id || null;

    if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });

    // forward cookies from the incoming request
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|; )token=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const res = await fetch(`${base}/api/v1/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Categories proxy DELETE error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
