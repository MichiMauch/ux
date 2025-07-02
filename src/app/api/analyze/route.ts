import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithOpenAI } from '@/lib/openai-client';
import { AnalysisResult } from '@/types/analysis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { screenshots, websiteType, url } = body;

    // Validate request
    if (!screenshots || !screenshots.desktop || !screenshots.mobile || !websiteType || !url) {
      return NextResponse.json(
        { error: 'Missing required fields: screenshots, websiteType, or url' },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    try {
      // Analyze with OpenAI
      const analysis = await analyzeWithOpenAI(screenshots, websiteType, url);
      
      const result: AnalysisResult = {
        id: generateId(),
        url,
        websiteType,
        analysisType: 'ux-analysis',
        overallScore: analysis.overallScore,
        categories: analysis.categories,
        summary: analysis.summary,
        timestamp: new Date().toISOString(),
        screenshots
      };

      return NextResponse.json(result);
    } catch (error) {
      console.error('Analysis error:', error);
      return NextResponse.json(
        { error: 'Failed to analyze website. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
