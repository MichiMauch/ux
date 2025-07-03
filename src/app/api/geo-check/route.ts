import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface GeoFactor {
  name: string;
  result: boolean;
  weight: number;
  comment: string;
  details?: string[];
}

interface GeoCheckResult {
  success: boolean;
  score: number;
  factors: GeoFactor[];
  url: string;
  timestamp: string;
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    console.log(`Starting GEO check for: ${url}`);

    // Fetch the HTML content
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GEO-Checker/1.0; +https://ux-analyzer.com/bot)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Initialize factors array
    const factors: GeoFactor[] = [];

    // 1. Structured Data Check (40% weight)
    const structuredDataResult = checkStructuredData($);
    factors.push({
      name: 'Structured Data',
      result: structuredDataResult.hasStructuredData,
      weight: 0.4,
      comment: structuredDataResult.comment,
      details: structuredDataResult.details
    });

    // 2. Semantic HTML Check (20% weight)
    const semanticHtmlResult = checkSemanticHTML($);
    factors.push({
      name: 'Semantisches HTML',
      result: semanticHtmlResult.hasSemanticHTML,
      weight: 0.2,
      comment: semanticHtmlResult.comment,
      details: semanticHtmlResult.details
    });

    // 3. Author Information Check (20% weight)
    const authorResult = checkAuthorInformation($);
    factors.push({
      name: 'Autoren-Information',
      result: authorResult.hasAuthorInfo,
      weight: 0.2,
      comment: authorResult.comment,
      details: authorResult.details
    });

    // 4. Content Structure Check (20% weight)
    const contentStructureResult = checkContentStructure($);
    factors.push({
      name: 'Inhaltliche Struktur',
      result: contentStructureResult.hasGoodStructure,
      weight: 0.2,
      comment: contentStructureResult.comment,
      details: contentStructureResult.details
    });

    // Calculate overall score (0-10 scale)
    const weightedScore = factors.reduce((sum, factor) => {
      return sum + (factor.result ? factor.weight : 0);
    }, 0);
    
    const score = Math.round(weightedScore * 10);

    const result: GeoCheckResult = {
      success: true,
      score,
      factors,
      url,
      timestamp: new Date().toISOString()
    };

    console.log(`GEO check completed for ${url}. Score: ${score}/10`);
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('GEO check error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        score: 0,
        factors: [],
        url: '',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Helper function to check structured data
function checkStructuredData($: cheerio.Root) {
  const structuredDataScripts = $('script[type="application/ld+json"]');
  const details: string[] = [];
  let hasValidStructuredData = false;
  const foundTypes: string[] = [];

  structuredDataScripts.each((_, element) => {
    try {
      const content = $(element).html();
      if (content) {
        const jsonData = JSON.parse(content);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const processData = (data: any) => {
          if (data['@type']) {
            foundTypes.push(data['@type']);
            
            // Check for important schema types
            if (['WebPage', 'Article', 'BlogPosting', 'Organization', 'Person', 'Product', 'LocalBusiness'].includes(data['@type'])) {
              hasValidStructuredData = true;
            }
            
            // Check for important fields
            if (data.author) details.push(`Autor gefunden: ${typeof data.author === 'string' ? data.author : 'strukturiert'}`);
            if (data.headline) details.push(`Headline: ${data.headline}`);
            if (data.datePublished) details.push(`Veröffentlichungsdatum: ${data.datePublished}`);
            if (data.mainEntity) details.push('MainEntity gefunden');
          }
        };

        if (Array.isArray(jsonData)) {
          jsonData.forEach(processData);
        } else {
          processData(jsonData);
        }
      }
    } catch {
      details.push('Fehlerhafte JSON-LD Struktur gefunden');
    }
  });

  let comment = '';
  if (structuredDataScripts.length === 0) {
    comment = 'Keine strukturierten Daten gefunden';
  } else if (hasValidStructuredData) {
    comment = `${foundTypes.join(', ')} gefunden`;
  } else {
    comment = `${structuredDataScripts.length} JSON-LD gefunden, aber keine relevanten Schema-Typen`;
  }

  return {
    hasStructuredData: hasValidStructuredData,
    comment,
    details
  };
}

// Helper function to check semantic HTML
function checkSemanticHTML($: cheerio.Root) {
  const details: string[] = [];
  let semanticScore = 0;

  // Check for semantic elements
  const semanticElements = ['main', 'article', 'section', 'header', 'footer'];
  const foundElements: string[] = [];
  
  semanticElements.forEach(element => {
    if ($(element).length > 0) {
      foundElements.push(element);
      semanticScore++;
    }
  });

  if (foundElements.length > 0) {
    details.push(`Semantic HTML gefunden: ${foundElements.join(', ')}`);
  }

  // Check heading structure
  const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const headingCounts: { [key: string]: number } = {};
  
  headings.forEach(heading => {
    const count = $(heading).length;
    if (count > 0) {
      headingCounts[heading.toUpperCase()] = count;
    }
  });

  if (Object.keys(headingCounts).length > 0) {
    details.push(`Überschriften: ${Object.entries(headingCounts).map(([tag, count]) => `${tag}(${count})`).join(', ')}`);
  }

  // Check for proper heading hierarchy
  const hasH1 = $('h1').length > 0;
  const hasMultipleH1 = $('h1').length > 1;
  
  if (hasH1 && !hasMultipleH1) {
    details.push('Korrekte H1-Struktur (genau eine H1)');
  } else if (!hasH1) {
    details.push('Keine H1-Überschrift gefunden');
  } else {
    details.push('Mehrere H1-Überschriften gefunden (nicht ideal)');
  }

  const hasGoodSemanticStructure = semanticScore >= 3 && hasH1 && !hasMultipleH1;

  return {
    hasSemanticHTML: hasGoodSemanticStructure,
    comment: hasGoodSemanticStructure 
      ? `${foundElements.length} semantische Elemente gefunden` 
      : `Nur ${foundElements.length} semantische Elemente gefunden`,
    details
  };
}

// Helper function to check author information
function checkAuthorInformation($: cheerio.Root) {
  const details: string[] = [];
  let hasAuthorInfo = false;

  // Check for author in meta tags
  const authorMeta = $('meta[name="author"]').attr('content');
  if (authorMeta) {
    details.push(`Meta-Autor: ${authorMeta}`);
    hasAuthorInfo = true;
  }

  // Check for author in structured data (already checked in structured data function)
  const structuredDataScripts = $('script[type="application/ld+json"]');
  let hasStructuredAuthor = false;
  
  structuredDataScripts.each((_, element) => {
    try {
      const content = $(element).html();
      if (content) {
        const jsonData = JSON.parse(content);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const checkAuthor = (data: any) => {
          if (data.author) {
            hasStructuredAuthor = true;
            hasAuthorInfo = true;
          }
        };

        if (Array.isArray(jsonData)) {
          jsonData.forEach(checkAuthor);
        } else {
          checkAuthor(jsonData);
        }
      }
    } catch {
      // Ignore parsing errors
    }
  });

  if (hasStructuredAuthor) {
    details.push('Autor in strukturierten Daten gefunden');
  }

  // Check for common author patterns in text
  const bodyText = $('body').text().toLowerCase();
  const authorPatterns = [
    /geschrieben von/,
    /autor:/,
    /verfasser:/,
    /von [a-z]+ [a-z]+/,
    /impressum/
  ];

  authorPatterns.forEach(pattern => {
    if (pattern.test(bodyText)) {
      details.push('Autor-Hinweise im Text gefunden');
      hasAuthorInfo = true;
    }
  });

  // Check for author class or data attributes
  const authorElements = $('[class*="author"], [data-author], .byline, .author-name');
  if (authorElements.length > 0) {
    details.push(`${authorElements.length} Autor-Elemente gefunden`);
    hasAuthorInfo = true;
  }

  return {
    hasAuthorInfo,
    comment: hasAuthorInfo 
      ? 'Autor-Informationen gefunden' 
      : 'Keine klaren Autor-Informationen gefunden',
    details
  };
}

// Helper function to check content structure
function checkContentStructure($: cheerio.Root) {
  const details: string[] = [];
  let structureScore = 0;

  // Check for paragraphs
  const paragraphs = $('p').length;
  if (paragraphs > 0) {
    details.push(`${paragraphs} Absätze gefunden`);
    structureScore++;
  }

  // Check for lists
  const lists = $('ul, ol').length;
  if (lists > 0) {
    details.push(`${lists} Listen gefunden`);
    structureScore++;
  }

  // Check for proper content length
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  const wordCount = bodyText.split(' ').length;
  if (wordCount > 100) {
    details.push(`${wordCount} Wörter Inhalt`);
    structureScore++;
  }

  // Check for subheadings within content
  const subheadings = $('h2, h3, h4').length;
  if (subheadings > 0) {
    details.push(`${subheadings} Zwischenüberschriften`);
    structureScore++;
  }

  const hasGoodStructure = structureScore >= 3;

  return {
    hasGoodStructure,
    comment: hasGoodStructure 
      ? 'Gute inhaltliche Struktur erkannt' 
      : 'Inhaltliche Struktur könnte verbessert werden',
    details
  };
}

// Health check endpoint
export async function POST() {
  return NextResponse.json({
    status: 'ok',
    service: 'geo-check',
    timestamp: new Date().toISOString()
  });
}