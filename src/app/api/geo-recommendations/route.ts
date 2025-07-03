import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GeoFactor {
  name: string;
  result: boolean;
  weight: number;
  comment: string;
  details?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { factors, url, score } = await request.json();

    if (!factors || !Array.isArray(factors)) {
      return NextResponse.json(
        { error: 'Factors array is required' },
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

    console.log(`Analyzing GEO recommendations for: ${url} (Score: ${score}/10)`);

    // Create a structured prompt for GPT based on GEO factors
    const factorsText = factors
      .map((factor: GeoFactor) => {
        const status = factor.result ? '✅ ERFÜLLT' : '❌ NICHT ERFÜLLT';
        const details = factor.details && factor.details.length > 0 
          ? `\nDetails: ${factor.details.join(', ')}`
          : '';
        return `${factor.name} (Gewichtung: ${Math.round(factor.weight * 100)}%) - ${status}\n${factor.comment}${details}`;
      })
      .join('\n\n');

    // Identify problematic areas
    const failedFactors = factors.filter((f: GeoFactor) => !f.result);
    const passedFactors = factors.filter((f: GeoFactor) => f.result);

    const prompt = `Du bist ein GEO (Generative Engine Optimization) Experte und sollst Handlungsempfehlungen für eine Website erstellen, damit sie besser von AI-Systemen wie ChatGPT, Google Gemini und Perplexity verstanden und zitiert wird.

Website: ${url}
GEO-Score: ${score}/10

ANALYSE DER GEO-FAKTOREN:
${factorsText}

ERFOLGREICH: ${passedFactors.length} von ${factors.length} Faktoren
VERBESSERUNGSBEDARF: ${failedFactors.length} Faktoren

Erstelle konkrete, umsetzbare Handlungsempfehlungen für die nicht erfüllten GEO-Faktoren. Fokussiere dich auf:

1. **Structured Data (Schema.org)** - Wenn fehlend: JSON-LD implementieren
2. **Semantisches HTML** - HTML5-Tags und Überschriftenstruktur optimieren  
3. **Autoren-Information** - Klare Autorenangaben maschinenlesbar machen
4. **Inhaltliche Struktur** - Content für AI-Systeme strukturieren

Für jede Empfehlung:
- Vergib eine Kategorie (Structured Data, Semantic HTML, Author Info, Content Structure, oder General)
- Bewerte die Auswirkung (high/medium/low) - high für Structured Data, medium für HTML/Autor, low für Content
- Erstelle einen prägnanten Titel
- Schreibe eine verständliche Erklärung (max. 2 Sätze)
- Gib 2-4 konkrete Handlungsschritte an
- Schätze die Schwierigkeit ein (easy/medium/hard)
- Erwähne geschätzte Verbesserungen falls relevant

Zielgruppe: Website-Betreiber und Entwickler
Sprache: Deutsch, professionell und direkt

Antworte ausschließlich mit gültigem JSON ohne Markdown:

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
          content: 'Du bist ein GEO-Experte (Generative Engine Optimization), der Websites für AI-Systeme optimiert. Antworte ausschließlich mit gültigem JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2500,
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

    console.log(`GEO recommendations analysis completed for: ${url}`);

    return NextResponse.json({
      url,
      timestamp: new Date().toISOString(),
      originalFactors: factors.length,
      recommendations: analysisResult.recommendations || []
    });

  } catch (error) {
    console.error('GEO Recommendations API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze GEO recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}