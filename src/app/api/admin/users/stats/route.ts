
import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET() {
  try {
    const totalUsersRes = await client.execute('SELECT COUNT(*) as count FROM users');
    const totalUsers = totalUsersRes.rows[0].count ?? 0;

    // For other stats like activeUsers, adminUsers, newThisMonth, userGrowth, and sourceDistribution,
    // the current 'users' table schema does not contain the necessary columns (e.g., lastLoginAt, role, createdAt, source).
    // These would need to be added to the 'users' table for accurate data.
    // For now, returning default/mock values for these.
    const stats = {
      totalUsers: totalUsers,
      activeUsers: 0, // Requires 'lastLoginAt' column in 'users' table
      adminUsers: 0,  // Requires 'role' column in 'users' table
      newThisMonth: 0, // Requires 'createdAt' column in 'users' table
      userGrowth: [],  // Requires 'createdAt' column in 'users' table
      sourceDistribution: [], // Requires 'source' column in 'users' table
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Admin user stats API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch user statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
