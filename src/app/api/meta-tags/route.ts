import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export type MetaTagCheck = {
  group: 'Meta Tags' | 'Open Graph Tags' | 'Twitter Cards';
  tag: string;
  present: boolean;
  content: string | null;
  recommendation?: string;
};

export type MetaAnalysisResult = {
  url: string;
  timestamp: string;
  checks: MetaTagCheck[];
  summary: {
    total: number;
    present: number;
    missing: number;
    score: number; // Percentage
  };
};

// Meta Tags Configuration with recommendations
interface TagConfig {
  selector: string;
  attribute?: string;
  recommendation: string;
}

interface MetaTagsConfig {
  [group: string]: {
    [tag: string]: TagConfig;
  };
}

const META_TAGS_CONFIG: MetaTagsConfig = {
  'Meta Tags': {
    'title': {
      selector: 'title',
      recommendation: 'Der Title-Tag ist entscheidend für SEO und wird in Suchergebnissen angezeigt. Sollte 50-60 Zeichen lang sein.'
    },
    'description': {
      selector: 'meta[name="description"]',
      attribute: 'content',
      recommendation: 'Die Meta-Description erscheint in Suchergebnissen und beeinflusst die Klickrate. Optimal sind 150-160 Zeichen.'
    },
    'canonical': {
      selector: 'link[rel="canonical"]',
      attribute: 'href',
      recommendation: 'Der Canonical-Tag verhindert Duplicate Content und hilft Suchmaschinen, die Hauptversion einer Seite zu identifizieren.'
    },
    'robots': {
      selector: 'meta[name="robots"]',
      attribute: 'content',
      recommendation: 'Das Robots-Tag steuert, wie Suchmaschinen Ihre Seite crawlen und indexieren sollen.'
    },
    'viewport': {
      selector: 'meta[name="viewport"]',
      attribute: 'content',
      recommendation: 'Das Viewport-Tag ist essentiell für responsive Design und mobile Optimierung.'
    }
  },
  'Open Graph Tags': {
    'og:title': {
      selector: 'meta[property="og:title"]',
      attribute: 'content',
      recommendation: 'Der og:title wird angezeigt, wenn Ihre Seite auf sozialen Medien geteilt wird. Sollte prägnant und ansprechend sein.'
    },
    'og:description': {
      selector: 'meta[property="og:description"]',
      attribute: 'content',
      recommendation: 'Die og:description erscheint beim Teilen auf sozialen Medien und sollte neugierig machen.'
    },
    'og:url': {
      selector: 'meta[property="og:url"]',
      attribute: 'content',
      recommendation: 'Die og:url sollte die kanonische URL der Seite sein und hilft bei der korrekten Zuordnung beim Teilen.'
    },
    'og:type': {
      selector: 'meta[property="og:type"]',
      attribute: 'content',
      recommendation: 'Der og:type definiert den Inhaltstyp (website, article, etc.) und verbessert die Darstellung auf sozialen Medien.'
    },
    'og:image': {
      selector: 'meta[property="og:image"]',
      attribute: 'content',
      recommendation: 'Das og:image wird als Vorschaubild beim Teilen angezeigt. Empfohlene Größe: 1200x630 Pixel.'
    }
  },
  'Twitter Cards': {
    'twitter:card': {
      selector: 'meta[name="twitter:card"]',
      attribute: 'content',
      recommendation: 'Die Twitter Card definiert, wie Ihre Inhalte auf Twitter angezeigt werden (summary, summary_large_image, etc.).'
    },
    'twitter:title': {
      selector: 'meta[name="twitter:title"]',
      attribute: 'content',
      recommendation: 'Der twitter:title wird auf Twitter angezeigt und sollte aussagekräftig und ansprechend sein.'
    },
    'twitter:description': {
      selector: 'meta[name="twitter:description"]',
      attribute: 'content',
      recommendation: 'Die twitter:description wird auf Twitter-Cards angezeigt und sollte den Inhalt kurz zusammenfassen.'
    },
    'twitter:image': {
      selector: 'meta[name="twitter:image"]',
      attribute: 'content',
      recommendation: 'Das twitter:image wird als Vorschaubild auf Twitter angezeigt. Empfohlene Größe: 1200x675 Pixel.'
    }
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    console.log(`Starting Meta Tags analysis for: ${url}`);

    // Fetch the HTML content
    const response = await fetch(validUrl.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'UX-Analyzer Meta Tags Bot/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 seconds
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: HTTP ${response.status}` },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const checks: MetaTagCheck[] = [];

    // Analyze each meta tag group
    Object.entries(META_TAGS_CONFIG).forEach(([groupName, tags]) => {
      Object.entries(tags).forEach(([tagName, config]) => {
        const element = $(config.selector).first();
        let content: string | null = null;
        let present = false;

        if (element.length > 0) {
          if (config.attribute) {
            content = element.attr(config.attribute) || null;
          } else {
            content = element.text() || null;
          }
          present = !!(content && content.trim().length > 0);
        }

        checks.push({
          group: groupName as MetaTagCheck['group'],
          tag: tagName,
          present,
          content: present ? content : null,
          recommendation: !present ? config.recommendation : undefined,
        });
      });
    });

    // Calculate summary statistics
    const total = checks.length;
    const present = checks.filter(check => check.present).length;
    const missing = total - present;
    const score = Math.round((present / total) * 100);

    const result: MetaAnalysisResult = {
      url: validUrl.toString(),
      timestamp: new Date().toISOString(),
      checks,
      summary: {
        total,
        present,
        missing,
        score,
      },
    };

    console.log(`Meta Tags analysis completed for: ${url}`, {
      score: result.summary.score,
      present: result.summary.present,
      missing: result.summary.missing,
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Meta Tags API Error:', error);
    
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Request timeout - URL took too long to respond' },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      {
        error: 'Failed to analyze meta tags',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
