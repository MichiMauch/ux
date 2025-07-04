import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET() {
  try {
    const emailSourcesResult = await client.execute(`
      SELECT email, COUNT(email) as count
      FROM email_sources
      GROUP BY email
    `);

    const reportDownloadsResult = await client.execute(`
      SELECT email, COUNT(email) as count
      FROM report_downloads
      GROUP BY email
    `);

    const aggregatedLeads: { [key: string]: number } = {};

    emailSourcesResult.rows.forEach(row => {
      const email = row.email as string;
      const count = row.count as number;
      aggregatedLeads[email] = (aggregatedLeads[email] || 0) + count;
    });

    reportDownloadsResult.rows.forEach(row => {
      const email = row.email as string;
      const count = row.count as number;
      aggregatedLeads[email] = (aggregatedLeads[email] || 0) + count;
    });

    const leads = Object.entries(aggregatedLeads)
      .map(([email, count]) => ({ email, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ message: 'Error fetching leads' }, { status: 500 });
  }
}