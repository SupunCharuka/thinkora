import { NextResponse } from 'next/server';

// Proxy DELETE /api/v1/contact/:id -> backend API
export async function DELETE(request, { params }) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    const id = params && params.id ? String(params.id) : null;
    if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });

    const target = `${apiBase.replace(/\/$/, '')}/api/v1/contact/${encodeURIComponent(id)}`;

    const headers = { accept: 'application/json' };
    const auth = request.headers.get('authorization');
    if (auth) headers['authorization'] = auth;
    const cookie = request.headers.get('cookie');
    if (cookie) headers['cookie'] = cookie;

    const res = await fetch(target, { method: 'DELETE', headers });
    const text = await res.text();
    const contentType = res.headers.get('content-type') || 'application/json';
    return new NextResponse(text, { status: res.status, headers: { 'content-type': contentType } });
  } catch (err) {
    console.error('Proxy DELETE /api/v1/contact/:id error', err);
    return NextResponse.json({ message: 'Proxy error' }, { status: 502 });
  }
}
