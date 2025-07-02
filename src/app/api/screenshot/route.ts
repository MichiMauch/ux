import { NextRequest, NextResponse } from 'next/server';
import { ScreenshotRequest, ScreenshotResponse } from '@/types/analysis';

// Simple placeholder screenshot service for Vercel deployment
class VercelCompatibleScreenshotService {
  async takeScreenshots(url: string): Promise<{ desktop: string; mobile: string }> {
    console.log(`Generating placeholder screenshots for: ${url}`);
    
    return {
      desktop: this.generatePlaceholder(url, 'desktop'),
      mobile: this.generatePlaceholder(url, 'mobile')
    };
  }

  private generatePlaceholder(url: string, device: 'desktop' | 'mobile'): string {
    const width = device === 'desktop' ? 1920 : 375;
    const height = device === 'desktop' ? 1080 : 812;
    const deviceName = device === 'desktop' ? 'Desktop' : 'Mobile';
    
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:0.1" />
            <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:0.1" />
          </linearGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#bg)"/>
        <rect x="0" y="0" width="100%" height="80" fill="#ffffff" stroke="#e5e7eb"/>
        <rect x="20" y="20" width="120" height="40" rx="8" fill="#f3f4f6"/>
        <rect x="${width - 140}" y="25" width="100" height="30" rx="15" fill="#4f46e5"/>
        
        <rect x="20" y="100" width="${width - 40}" height="50" rx="8" fill="#ffffff" stroke="#e5e7eb"/>
        <circle cx="50" cy="125" r="15" fill="#06b6d4"/>
        <rect x="80" y="115" width="100" height="20" rx="10" fill="#f3f4f6"/>
        
        <rect x="20" y="170" width="${width - 40}" height="${height - 250}" rx="12" fill="#ffffff" stroke="#e5e7eb"/>
        <rect x="40" y="190" width="${width - 80}" height="80" rx="8" fill="#f8fafc"/>
        
        <text x="${width / 2}" y="${height / 2 - 40}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="28" font-weight="600" fill="#374151">
          ${deviceName} Vorschau
        </text>
        <text x="${width / 2}" y="${height / 2}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" fill="#6b7280">
          ${this.truncateUrl(url, device === 'mobile' ? 30 : 60)}
        </text>
        <text x="${width / 2}" y="${height / 2 + 30}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="#9ca3af">
          Screenshot-Simulation für Demo-Zwecke
        </text>
      </svg>
    `;
    
    const base64Svg = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64Svg}`;
  }

  private truncateUrl(url: string, maxLength: number): string {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength - 3) + '...';
  }
}

const screenshotService = new VercelCompatibleScreenshotService();

export async function POST(request: NextRequest) {
  try {
    const body: ScreenshotRequest = await request.json();
    const { url } = body;

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    // Generate unique ID for this screenshot request
    const id = generateId();

    try {
      // Take screenshots using external service
      console.log(`Starting screenshot process for: ${url}`);
      const screenshots = await screenshotService.takeScreenshots(url);
      
      const response: ScreenshotResponse = {
        id,
        status: 'completed',
        screenshots
      };
      
      console.log(`Screenshots completed successfully for: ${url}`);
      return NextResponse.json(response);
    } catch (error) {
      console.error('Screenshot error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      const response: ScreenshotResponse = {
        id,
        status: 'error',
        error: `Failed to capture screenshots: ${errorMessage}. Please check if the website is accessible and try again.`
      };

      return NextResponse.json(response, { status: 500 });
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
}

function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
