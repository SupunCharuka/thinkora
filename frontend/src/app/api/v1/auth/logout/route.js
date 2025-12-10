import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear the token cookie by setting Max-Age=0
    const cookie = `token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
    return NextResponse.json({ message: 'Logged out' }, { status: 200, headers: { 'Set-Cookie': cookie } });
  } catch (err) {
    console.error('Logout proxy error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
