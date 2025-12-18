import { NextResponse } from 'next/server';

// Proxy GET /api/v1/users -> backend API
export async function GET(request) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    const target = `${apiBase.replace(/\/$/, '')}/api/v1/users`;

    // Forward Authorization and cookies if present
    const headers = {};
    const auth = request.headers.get('authorization');
    if (auth) headers['authorization'] = auth;
    const cookie = request.headers.get('cookie');
    if (cookie) headers['cookie'] = cookie;
    headers['accept'] = 'application/json';

    const res = await fetch(target, { method: 'GET', headers });
    const body = await res.text();

    const contentType = res.headers.get('content-type') || 'application/json';
    return new NextResponse(body, { status: res.status, headers: { 'content-type': contentType } });
  } catch (err) {
    console.error('Proxy /api/v1/users error', err);
    return NextResponse.json({ message: 'Proxy error' }, { status: 502 });
  }
}
