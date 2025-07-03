import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface PageSpeedOpportunity {
  id: string;
  title: string;
  description: string;
  displayValue: string;
}

export interface SimplifiedRecommendation {
  category: string;
  impact: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionSteps: string[];
  estimatedSavings?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export async function POST(request: NextRequest) {
  try {
    const { opportunities, url, scores } = await request.json();

    if (!opportunities || !Array.isArray(opportunities)) {
      return NextResponse.json(
        { error: 'Opportunities array is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API not configured' },
        { status: 500 }
      );
    }

    console.log(`Analyzing PageSpeed recommendations for: ${url}`);

    // Create a structured prompt for GPT
    const opportunitiesText = opportunities
      .map((opp: PageSpeedOpportunity) => 
        `${opp.title}\n${opp.description}\n${opp.displayValue ? `Potentielle Einsparung: ${opp.displayValue}` : ''}`
      )
      .join('\n\n');

    const prompt = `Du bist ein UX/Performance-Experte und sollst technische PageSpeed-Empfehlungen in verständliche Handlungsempfehlungen für Website-Betreiber umwandeln.

Website: ${url}
Performance-Score: ${scores?.performance || 'N/A'}/100
Accessibility-Score: ${scores?.accessibility || 'N/A'}/100

Technische PageSpeed-Empfehlungen:
${opportunitiesText}

Wandle diese technischen Empfehlungen in benutzerfreundliche Handlungsempfehlungen um. Für jede Empfehlung:

1. Vergib eine Kategorie (Performance, Bilder, Code, Benutzerfreundlichkeit, SEO)
2. Bewerte die Auswirkung (high/medium/low)
3. Erstelle einen verständlichen Titel
4. Schreibe eine einfache Erklärung (max. 2 Sätze)
5. Gib konkrete Handlungsschritte an
6. Schätze die Schwierigkeit ein (easy/medium/hard)
7. Erwähne potentielle Einsparungen falls verfügbar

Zielgruppe: Website-Betreiber ohne technischen Hintergrund.
Sprache: Deutsch, verständlich und direkt.

Antworte ausschließlich mit gültigem JSON ohne Markdown-Formatierung:

{
  "recommendations": [
    {
      "category": "string",
      "impact": "high|medium|low",
      "title": "string",
      "description": "string",
      "actionSteps": ["string", "string", "string"],
      "estimatedSavings": "string",
      "difficulty": "easy|medium|hard"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein UX/Performance-Experte, der technische Empfehlungen in verständliche Handlungsempfehlungen umwandelt. Antworte ausschließlich mit gültigem JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    // Clean and parse JSON response
    const cleanedResponse = responseContent
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    let analysisResult;
    try {
      analysisResult = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', cleanedResponse);
      throw new Error(`Invalid JSON response from OpenAI: ${parseError}`);
    }

    console.log(`PageSpeed recommendations analysis completed for: ${url}`);

    return NextResponse.json({
      url,
      timestamp: new Date().toISOString(),
      originalOpportunities: opportunities.length,
      recommendations: analysisResult.recommendations || []
    });

  } catch (error) {
    console.error('PageSpeed Recommendations API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze PageSpeed recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
