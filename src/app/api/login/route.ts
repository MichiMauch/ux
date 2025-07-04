
import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';


const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-default-secret');

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const result = await client.execute({
      sql: 'SELECT id, email, password FROM users WHERE email = ?',
      args: [email],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Ungültige Anmeldedaten' }, { status: 401 });
    }

    const user = result.rows[0];
    const hashedPassword = user.password as string;

    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid) {
      return NextResponse.json({ message: 'Ungültige Anmeldedaten' }, { status: 401 });
    }

    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(JWT_SECRET);

    (cookies() as any).set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return NextResponse.json({ message: 'Login erfolgreich' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Serverfehler' }, { status: 500 });
  }
}
