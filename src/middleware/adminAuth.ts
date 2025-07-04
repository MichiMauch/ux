import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-default-secret');

export async function adminAuth(req: NextRequest) {
  const sessionCookie = req.cookies.get('session');

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  try {
    await jwtVerify(sessionCookie.value, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    const response = NextResponse.redirect(new URL('/admin/login', req.url));
    response.cookies.delete('session'); // Invalid token, so delete it
    return response;
  }
}