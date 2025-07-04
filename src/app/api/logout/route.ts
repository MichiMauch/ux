
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  (cookies() as any).delete('session');
  return NextResponse.json({ message: 'Logout erfolgreich' });
}
