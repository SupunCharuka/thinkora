import { NextResponse } from 'next/server';

// Helper to build target URL
function buildTarget(apiBase) {
  return `${apiBase.replace(/\/$/, '')}/api/v1/contact`;
}

// Proxy POST /api/v1/contact -> backend API
export async function POST(request) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    const target = `${apiBase.replace(/\/$/, '')}/api/v1/contact`;

    const body = await request.json().catch(() => null);

    const headers = { 'content-type': 'application/json', accept: 'application/json' };
    const auth = request.headers.get('authorization');
    if (auth) headers['authorization'] = auth;
    const cookie = request.headers.get('cookie');
    if (cookie) headers['cookie'] = cookie;

    const res = await fetch(target, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    const text = await res.text();
    const contentType = res.headers.get('content-type') || 'application/json';
    return new NextResponse(text, { status: res.status, headers: { 'content-type': contentType } });
  } catch (err) {
    console.error('Proxy /api/v1/contact error', err);
    return NextResponse.json({ message: 'Proxy error' }, { status: 502 });
  }
}

// Proxy GET /api/v1/contact -> backend API (protected)
export async function GET(request) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    const target = buildTarget(apiBase);

    const headers = { accept: 'application/json' };
    const auth = request.headers.get('authorization');
    if (auth) headers['authorization'] = auth;
    const cookie = request.headers.get('cookie');
    if (cookie) headers['cookie'] = cookie;

    const res = await fetch(target, {
      method: 'GET',
      headers,
    });

    const text = await res.text();
    const contentType = res.headers.get('content-type') || 'application/json';
    return new NextResponse(text, { status: res.status, headers: { 'content-type': contentType } });
  } catch (err) {
    console.error('Proxy GET /api/v1/contact error', err);
    return NextResponse.json({ message: 'Proxy error' }, { status: 502 });
  }
}
