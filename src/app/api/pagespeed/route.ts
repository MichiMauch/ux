import { NextRequest, NextResponse } from 'next/server';

// Type definitions for PageSpeed Insights API response
interface PageSpeedMetric {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
  numericValue?: number;
  numericUnit?: string;
}

interface PageSpeedAudit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
  numericValue?: number;
  numericUnit?: string;
  details?: {
    type: string;
    [key: string]: unknown;
  };
}

interface PageSpeedResult {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  metrics: {
    firstContentfulPaint: PageSpeedMetric;
    largestContentfulPaint: PageSpeedMetric;
    firstInputDelay: PageSpeedMetric;
    cumulativeLayoutShift: PageSpeedMetric;
    speedIndex: PageSpeedMetric;
    totalBlockingTime: PageSpeedMetric;
  };
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    displayValue: string;
    details?: {
      type: string;
      [key: string]: unknown;
    };
  }>;
  url: string;
  timestamp: string;
}

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
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_PAGESPEED_API_KEY is not configured');
      return NextResponse.json(
        { error: 'PageSpeed API not configured' },
        { status: 500 }
      );
    }

    console.log(`Starting PageSpeed analysis for: ${url}`);

    // Call Google PageSpeed Insights API
    const pagespeedUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
    pagespeedUrl.searchParams.set('url', url);
    pagespeedUrl.searchParams.set('key', apiKey);
    pagespeedUrl.searchParams.set('strategy', 'desktop'); // or 'mobile'
    // Add all categories as separate parameters
    pagespeedUrl.searchParams.append('category', 'performance');
    pagespeedUrl.searchParams.append('category', 'accessibility');
    pagespeedUrl.searchParams.append('category', 'best-practices');
    pagespeedUrl.searchParams.append('category', 'seo');

    const response = await fetch(pagespeedUrl.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'UX-Analyzer/1.0',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('PageSpeed API Error:', response.status, errorData);
      return NextResponse.json(
        { error: `PageSpeed API returned ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Debug: Log the raw API response structure
    console.log('Raw PageSpeed API response structure:', {
      hasLighthouseResult: !!data.lighthouseResult,
      hasCategories: !!data.lighthouseResult?.categories,
      categoriesKeys: data.lighthouseResult?.categories ? Object.keys(data.lighthouseResult.categories) : [],
      hasAudits: !!data.lighthouseResult?.audits,
      auditsCount: data.lighthouseResult?.audits ? Object.keys(data.lighthouseResult.audits).length : 0
    });
    
    // Extract scores from lighthouse results
    const lighthouse = data.lighthouseResult;
    const categories = lighthouse.categories;
    const audits = lighthouse.audits;

    // Debug: Log category scores
    console.log('Category scores:', {
      performance: categories.performance?.score,
      accessibility: categories.accessibility?.score,
      bestPractices: categories['best-practices']?.score,
      seo: categories.seo?.score
    });

    // Extract core web vitals and performance metrics
    const result: PageSpeedResult = {
      performance: Math.round((categories.performance?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
      seo: Math.round((categories.seo?.score || 0) * 100),
      metrics: {
        firstContentfulPaint: {
          id: 'first-contentful-paint',
          title: 'First Contentful Paint',
          description: 'First Contentful Paint marks the time at which the first text or image is painted.',
          score: audits['first-contentful-paint']?.score ? Math.round(audits['first-contentful-paint'].score * 100) : null,
          displayValue: audits['first-contentful-paint']?.displayValue || 'N/A',
          numericValue: audits['first-contentful-paint']?.numericValue,
          numericUnit: audits['first-contentful-paint']?.numericUnit
        },
        largestContentfulPaint: {
          id: 'largest-contentful-paint',
          title: 'Largest Contentful Paint',
          description: 'Largest Contentful Paint marks the time at which the largest text or image is painted.',
          score: audits['largest-contentful-paint']?.score ? Math.round(audits['largest-contentful-paint'].score * 100) : null,
          displayValue: audits['largest-contentful-paint']?.displayValue || 'N/A',
          numericValue: audits['largest-contentful-paint']?.numericValue,
          numericUnit: audits['largest-contentful-paint']?.numericUnit
        },
        firstInputDelay: {
          id: 'first-input-delay',
          title: 'First Input Delay',
          description: 'First Input Delay measures the time from when a user first interacts with a page to when the browser is able to respond.',
          score: audits['max-potential-fid']?.score ? Math.round(audits['max-potential-fid'].score * 100) : null,
          displayValue: audits['max-potential-fid']?.displayValue || 'N/A',
          numericValue: audits['max-potential-fid']?.numericValue,
          numericUnit: audits['max-potential-fid']?.numericUnit
        },
        cumulativeLayoutShift: {
          id: 'cumulative-layout-shift',
          title: 'Cumulative Layout Shift',
          description: 'Cumulative Layout Shift measures the movement of visible elements within the viewport.',
          score: audits['cumulative-layout-shift']?.score ? Math.round(audits['cumulative-layout-shift'].score * 100) : null,
          displayValue: audits['cumulative-layout-shift']?.displayValue || 'N/A',
          numericValue: audits['cumulative-layout-shift']?.numericValue,
          numericUnit: audits['cumulative-layout-shift']?.numericUnit
        },
        speedIndex: {
          id: 'speed-index',
          title: 'Speed Index',
          description: 'Speed Index shows how quickly the contents of a page are visibly populated.',
          score: audits['speed-index']?.score ? Math.round(audits['speed-index'].score * 100) : null,
          displayValue: audits['speed-index']?.displayValue || 'N/A',
          numericValue: audits['speed-index']?.numericValue,
          numericUnit: audits['speed-index']?.numericUnit
        },
        totalBlockingTime: {
          id: 'total-blocking-time',
          title: 'Total Blocking Time',
          description: 'Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms.',
          score: audits['total-blocking-time']?.score ? Math.round(audits['total-blocking-time'].score * 100) : null,
          displayValue: audits['total-blocking-time']?.displayValue || 'N/A',
          numericValue: audits['total-blocking-time']?.numericValue,
          numericUnit: audits['total-blocking-time']?.numericUnit
        }
      },
      opportunities: Object.values(audits as Record<string, PageSpeedAudit>)
        .filter((audit: PageSpeedAudit) => audit.details && audit.details.type === 'opportunity')
        .slice(0, 5) // Top 5 opportunities
        .map((audit: PageSpeedAudit) => ({
          id: audit.id,
          title: audit.title,
          description: audit.description,
          displayValue: audit.displayValue || '',
          details: audit.details
        })),
      url: lighthouse.finalUrl || url,
      timestamp: new Date().toISOString()
    };

    console.log(`PageSpeed analysis completed for: ${url}`, {
      performance: result.performance,
      accessibility: result.accessibility,
      bestPractices: result.bestPractices,
      seo: result.seo
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('PageSpeed API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze page speed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
