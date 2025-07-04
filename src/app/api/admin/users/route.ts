import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET() {
  try {
    const result = await client.execute('SELECT id, email FROM users');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await client.execute({
      sql: 'INSERT INTO users (email, password) VALUES (?, ?)',
      args: [email, hashedPassword],
    });
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, email, password } = await request.json();

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await client.execute({
        sql: 'UPDATE users SET email = ?, password = ? WHERE id = ?',
        args: [email, hashedPassword, id],
      });
    } else {
      await client.execute({
        sql: 'UPDATE users SET email = ? WHERE id = ?',
        args: [email, id],
      });
    }

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await client.execute({
      sql: 'DELETE FROM users WHERE id = ?',
      args: [id],
    });
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
  }
}