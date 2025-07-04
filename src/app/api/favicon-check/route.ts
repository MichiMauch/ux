import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export interface FaviconCheck {
  type: "favicon" | "apple-touch-icon" | "manifest" | "tile";
  size: string;
  href: string;
  present: boolean;
  description: string;
  recommendation?: string;
}

export interface FaviconAnalysisResult {
  url: string;
  timestamp: string;
  checks: FaviconCheck[];
  summary: {
    total: number;
    present: number;
    missing: number;
    score: number;
  };
  icons: {
    favicon?: string;
    appleTouchIcon?: string;
    icon192?: string;
    icon512?: string;
  };
}

// Standard checks für Favicon und Touch Icons
const STANDARD_CHECKS: Omit<FaviconCheck, 'present' | 'href'>[] = [
  {
    type: "favicon",
    size: "16x16",
    description: "Standard Favicon für Browser Tabs",
    recommendation: "Fügen Sie ein 16x16 Pixel Favicon hinzu: <link rel=\"icon\" type=\"image/png\" sizes=\"16x16\" href=\"/favicon-16x16.png\">"
  },
  {
    type: "favicon",
    size: "32x32",
    description: "Hochauflösendes Favicon für moderne Browser",
    recommendation: "Fügen Sie ein 32x32 Pixel Favicon hinzu: <link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/favicon-32x32.png\">"
  },
  {
    type: "favicon",
    size: "96x96",
    description: "Favicon für Android Chrome",
    recommendation: "Fügen Sie ein 96x96 Pixel Favicon hinzu: <link rel=\"icon\" type=\"image/png\" sizes=\"96x96\" href=\"/favicon-96x96.png\">"
  },
  {
    type: "apple-touch-icon",
    size: "180x180",
    description: "Apple Touch Icon für iOS Safari",
    recommendation: "Fügen Sie ein Apple Touch Icon hinzu: <link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"/apple-touch-icon.png\">"
  },
  {
    type: "apple-touch-icon",
    size: "152x152",
    description: "Apple Touch Icon für iPad",
    recommendation: "Fügen Sie ein iPad Apple Touch Icon hinzu: <link rel=\"apple-touch-icon\" sizes=\"152x152\" href=\"/apple-touch-icon-152x152.png\">"
  },
  {
    type: "apple-touch-icon",
    size: "120x120",
    description: "Apple Touch Icon für iPhone",
    recommendation: "Fügen Sie ein iPhone Apple Touch Icon hinzu: <link rel=\"apple-touch-icon\" sizes=\"120x120\" href=\"/apple-touch-icon-120x120.png\">"
  },
  {
    type: "manifest",
    size: "192x192",
    description: "Web App Manifest Icon (klein)",
    recommendation: "Fügen Sie Icons zu Ihrem Web App Manifest hinzu mit 192x192 Pixel Größe"
  },
  {
    type: "manifest",
    size: "512x512",
    description: "Web App Manifest Icon (groß)",
    recommendation: "Fügen Sie Icons zu Ihrem Web App Manifest hinzu mit 512x512 Pixel Größe"
  },
  {
    type: "tile",
    size: "144x144",
    description: "Windows Metro Tile",
    recommendation: "Fügen Sie ein Windows Tile hinzu: <meta name=\"msapplication-TileImage\" content=\"/mstile-144x144.png\">"
  }
];

async function checkFaviconAndIcons(url: string): Promise<FaviconAnalysisResult> {
  try {
    // Parse URL to get base domain
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
    
    // Fetch the HTML page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Initialize results
    const foundIcons: { [key: string]: string } = {};
    const checks: FaviconCheck[] = [];
    
    // Check for standard favicon.ico
    try {
      const faviconResponse = await fetch(`${baseUrl}/favicon.ico`, { method: 'HEAD' });
      if (faviconResponse.ok) {
        foundIcons['favicon.ico'] = `${baseUrl}/favicon.ico`;
      }
    } catch (error) {
      // Favicon.ico not found
      console.log('No favicon.ico found:', error);
    }
    
    // Parse all link tags for icons
    $('link[rel*="icon"], link[rel*="apple-touch-icon"], link[rel="manifest"]').each((_, element) => {
      const $el = $(element);
      const rel = $el.attr('rel');
      const href = $el.attr('href');
      const sizes = $el.attr('sizes');
      const type = $el.attr('type');
      
      if (href) {
        const fullHref = href.startsWith('http') ? href : `${baseUrl}${href.startsWith('/') ? '' : '/'}${href}`;
        
        if (rel?.includes('apple-touch-icon')) {
          foundIcons[`apple-touch-icon-${sizes || 'default'}`] = fullHref;
        } else if (rel?.includes('icon')) {
          foundIcons[`icon-${sizes || type || 'default'}`] = fullHref;
        } else if (rel === 'manifest') {
          foundIcons['manifest'] = fullHref;
        }
      }
    });
    
    // Check meta tags for Windows tiles
    $('meta[name*="msapplication"]').each((_, element) => {
      const $el = $(element);
      const name = $el.attr('name');
      const content = $el.attr('content');
      
      if (name === 'msapplication-TileImage' && content) {
        const fullHref = content.startsWith('http') ? content : `${baseUrl}${content.startsWith('/') ? '' : '/'}${content}`;
        foundIcons['mstile'] = fullHref;
      }
    });
    
    // If manifest exists, try to parse it for additional icons
    if (foundIcons.manifest) {
      try {
        const manifestResponse = await fetch(foundIcons.manifest);
        if (manifestResponse.ok) {
          const manifest = await manifestResponse.json();
          if (manifest.icons && Array.isArray(manifest.icons)) {
            manifest.icons.forEach((icon: any) => {
              if (icon.src && icon.sizes) {
                const fullSrc = icon.src.startsWith('http') ? icon.src : `${baseUrl}${icon.src.startsWith('/') ? '' : '/'}${icon.src}`;
                foundIcons[`manifest-${icon.sizes}`] = fullSrc;
              }
            });
          }
        }
      } catch (error) {
        console.log('Error parsing manifest:', error);
      }
    }
    
    // Process each standard check
    for (const standardCheck of STANDARD_CHECKS) {
      let present = false;
      let href = '';
      
      // Check if we found this type and size
      if (standardCheck.type === 'favicon') {
        // Check for specific favicon sizes
        const sizeKey = `icon-${standardCheck.size}`;
        if (foundIcons[sizeKey]) {
          present = true;
          href = foundIcons[sizeKey];
        } else if (standardCheck.size === '16x16' && foundIcons['favicon.ico']) {
          present = true;
          href = foundIcons['favicon.ico'];
        }
      } else if (standardCheck.type === 'apple-touch-icon') {
        const sizeKey = `apple-touch-icon-${standardCheck.size}`;
        if (foundIcons[sizeKey] || foundIcons['apple-touch-icon-default']) {
          present = true;
          href = foundIcons[sizeKey] || foundIcons['apple-touch-icon-default'];
        }
      } else if (standardCheck.type === 'manifest') {
        const manifestSizeKey = `manifest-${standardCheck.size}`;
        if (foundIcons[manifestSizeKey]) {
          present = true;
          href = foundIcons[manifestSizeKey];
        }
      } else if (standardCheck.type === 'tile') {
        if (foundIcons.mstile) {
          present = true;
          href = foundIcons.mstile;
        }
      }
      
      checks.push({
        ...standardCheck,
        present,
        href
      });
    }
    
    // Calculate summary
    const total = checks.length;
    const present = checks.filter(check => check.present).length;
    const missing = total - present;
    const score = Math.round((present / total) * 100);
    
    // Extract main icons for display
    const icons: any = {};
    if (foundIcons['favicon.ico'] || foundIcons['icon-16x16'] || foundIcons['icon-32x32']) {
      icons.favicon = foundIcons['favicon.ico'] || foundIcons['icon-16x16'] || foundIcons['icon-32x32'];
    }
    if (foundIcons['apple-touch-icon-180x180'] || foundIcons['apple-touch-icon-default']) {
      icons.appleTouchIcon = foundIcons['apple-touch-icon-180x180'] || foundIcons['apple-touch-icon-default'];
    }
    if (foundIcons['manifest-192x192']) {
      icons.icon192 = foundIcons['manifest-192x192'];
    }
    if (foundIcons['manifest-512x512']) {
      icons.icon512 = foundIcons['manifest-512x512'];
    }
    
    return {
      url,
      timestamp: new Date().toISOString(),
      checks,
      summary: {
        total,
        present,
        missing,
        score
      },
      icons
    };
    
  } catch (error) {
    console.error('Error analyzing favicon and icons:', error);
    throw new Error(`Failed to analyze favicon and icons: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
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
    
    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }
    
    const result = await checkFaviconAndIcons(url);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Favicon check API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze favicon and icons',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}