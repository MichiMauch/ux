import { NextRequest, NextResponse } from 'next/server';
import { analyzeHeatmapPrediction } from '@/lib/openai-client';
import { HeatmapPrediction, WebsiteType } from '@/types/analysis';

export async function POST(request: NextRequest) {
  try {
    const { screenshots, websiteType, url } = await request.json();

    if (!screenshots?.desktop || !screenshots?.mobile) {
      return NextResponse.json(
        { error: 'Desktop and mobile screenshots are required' },
        { status: 400 }
      );
    }

    if (!websiteType || !url) {
      return NextResponse.json(
        { error: 'Website type and URL are required' },
        { status: 400 }
      );
    }

    console.log('Starting heatmap prediction analysis for:', url);

    const heatmapData: HeatmapPrediction = await analyzeHeatmapPrediction(
      screenshots,
      websiteType as WebsiteType,
      url
    );

    console.log('Heatmap analysis completed successfully');

    return NextResponse.json({
      success: true,
      heatmapData,
      url,
      websiteType,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Heatmap analysis error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze heatmap prediction',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
