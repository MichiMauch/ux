import { NextRequest, NextResponse } from 'next/server';
import tursoClient from '@/lib/turso-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const analysisId = searchParams.get('analysisId');

    if (!analysisId) {
      return NextResponse.json(
        { success: false, error: 'analysisId parameter is required' },
        { status: 400 }
      );
    }

    console.log(`Fetching GEO data for analysis ID: ${analysisId}`);

    // Get GEO score from analyses table
    const analysisResult = await tursoClient.execute(
      'SELECT geo_score FROM analyses WHERE id = ?',
      [analysisId]
    );

    if (analysisResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Analysis not found' },
        { status: 404 }
      );
    }

    const geoScore = analysisResult.rows[0].geo_score as number || 0;

    // Get GEO factors with details
    const factorsResult = await tursoClient.execute(
      'SELECT name, result, weight, comment, details, created_at FROM geo_factors WHERE analysis_id = ? ORDER BY created_at',
      [analysisId]
    );

    const factors = factorsResult.rows.map(row => ({
      name: row.name as string,
      result: Boolean(row.result),
      weight: row.weight as number,
      comment: row.comment as string,
      details: row.details ? JSON.parse(row.details as string) : []
    }));

    const result = {
      success: true,
      score: geoScore,
      factors,
      timestamp: factorsResult.rows[0]?.created_at || new Date().toISOString(),
      source: 'database'
    };

    console.log(`GEO data retrieved for analysis ${analysisId}. Score: ${geoScore}/10`);
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching GEO data:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch GEO data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}