
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Helper to get start date based on range
const getStartDate = (range: string) => {
  const date = new Date();
  switch (range) {
    case '7d':
      date.setDate(date.getDate() - 7);
      break;
    case '30d':
      date.setDate(date.getDate() - 30);
      break;
    case '90d':
      date.setDate(date.getDate() - 90);
      break;
    default:
      date.setDate(date.getDate() - 30); // Default to 30 days
  }
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

// Helper to extract domain from URL
const getDomain = (url: string) => {
  try {
    const hostname = new URL(url).hostname;
    // Remove www. and subdomains for better grouping
    const parts = hostname.split('.');
    if (parts.length > 2 && parts[0] === 'www') {
      return parts.slice(1).join('.');
    } else if (parts.length > 2) {
      return parts.slice(parts.length - 2).join('.');
    }
    return hostname;
  } catch (e) {
    return 'unknown';
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';
    const startDate = getStartDate(range);

    const [analysesRes, usersRes, downloadsRes, leadsRes] = await Promise.all([
      client.execute('SELECT COUNT(*) as count FROM analyses'),
      client.execute('SELECT COUNT(*) as count FROM users'),
      client.execute('SELECT COUNT(*) as count FROM report_downloads'),
      client.execute('SELECT COUNT(*) as count FROM email_sources'),
    ]);

    // Today's Analyses
    const today = new Date().toISOString().split('T')[0];
    const todayAnalysesRes = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM analyses WHERE DATE(timestamp) = ?',
      args: [today],
    });
    const todayAnalyses = todayAnalysesRes.rows[0].count ?? 0;

    // Average Score
    const avgScoreRes = await client.execute({
      sql: 'SELECT AVG(ux_score) as avgScore FROM analyses WHERE timestamp >= ?',
      args: [startDate],
    });
    const avgScore = avgScoreRes.rows[0].avgScore ?? 0;

    // Recent Analyses
    const recentAnalysesRes = await client.execute({
      sql: `SELECT
              T1.id,
              T2.url,
              T1.ux_score as score,
              T1.timestamp,
              T2.email as userEmail
            FROM analyses T1
            JOIN leads T2 ON T1.lead_id = T2.id
            WHERE T1.timestamp >= ?
            ORDER BY T1.timestamp DESC
            LIMIT 5`,
      args: [startDate],
    });
    const recentAnalyses = recentAnalysesRes.rows.map(row => ({
      id: row.id,
      url: row.url,
      score: row.score,
      timestamp: row.timestamp,
      userEmail: row.userEmail,
    }));

    // Recent Email Sources (Recommendations)
    const recentEmailSourcesRes = await client.execute({
      sql: `SELECT
              email,
              source,
              created_at as timestamp
            FROM email_sources
            ORDER BY created_at DESC
            LIMIT 5`,
    });
    const recentEmailSources = recentEmailSourcesRes.rows.map(row => ({
      email: row.email,
      source: row.source,
      timestamp: row.timestamp,
    }));

    // Recent Report Downloads
    const recentReportDownloadsRes = await client.execute({
      sql: `SELECT
              email,
              report_type,
              timestamp
            FROM report_downloads
            ORDER BY timestamp DESC
            LIMIT 5`,
    });
    const recentReportDownloads = recentReportDownloadsRes.rows.map(row => ({
      email: row.email,
      reportType: row.report_type,
      timestamp: row.timestamp,
    }));

    // Popular Domains & Daily Stats (fetch all relevant data and process in JS)
    const allAnalysesInPeriodRes = await client.execute({
      sql: `SELECT
              T1.ux_score,
              T1.timestamp,
              T2.url
            FROM analyses T1
            JOIN leads T2 ON T1.lead_id = T2.id
            WHERE T1.timestamp >= ?`,
      args: [startDate],
    });

    const domainCounts: { [key: string]: number } = {};
    const dailyStatsMap: { [key: string]: { analyses: number; totalScore: number; count: number } } = {};

    allAnalysesInPeriodRes.rows.forEach(row => {
      // Popular Domains
      const domain = getDomain(row.url as string);
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;

      // Daily Stats
      const date = (row.timestamp as string).split('T')[0];
      if (!dailyStatsMap[date]) {
        dailyStatsMap[date] = { analyses: 0, totalScore: 0, count: 0 };
      }
      dailyStatsMap[date].analyses += 1;
      dailyStatsMap[date].totalScore += (row.ux_score as number);
      dailyStatsMap[date].count += 1;
    });

    const popularDomains = Object.entries(domainCounts)
      .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, count }));

    const dailyStats = Object.entries(dailyStatsMap)
      .map(([date, data]) => ({
        date,
        analyses: data.analyses,
        avgScore: data.totalScore / data.count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const stats = {
      totalAnalyses: analysesRes.rows[0].count ?? 0,
      totalUsers: usersRes.rows[0].count ?? 0,
      totalDownloads: downloadsRes.rows[0].count ?? 0,
      totalLeads: leadsRes.rows[0].count ?? 0,
      todayAnalyses: todayAnalyses,
      avgScore: avgScore,
      recentAnalyses: recentAnalyses,
      recentEmailSources: recentEmailSources,
      recentReportDownloads: recentReportDownloads,
      popularDomains: popularDomains,
      dailyStats: dailyStats,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Admin stats API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch admin statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
