import { NextRequest, NextResponse } from 'next/server';
import { ScreenshotRequest, ScreenshotResponse } from '@/types/analysis';
import { NodehiveScreenshotService } from '@/lib/nodehive-screenshot-service';

// Nodehive Screenshot Service - Full Page Screenshots
const screenshotService = new NodehiveScreenshotService();

export async function POST(request: NextRequest) {
  try {
    const body: ScreenshotRequest = await request.json();
    const { url } = body;

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL provided. Please provide a valid HTTP or HTTPS URL.' },
        { status: 400 }
      );
    }

    // Generate unique ID for this screenshot request
    const id = generateId();

    try {
      // Take screenshots using Nodehive service (full-page)
      console.log(`Starting Nodehive full-page screenshot process for: ${url}`);
      const screenshots = await screenshotService.takeScreenshots(url);
      
      const response: ScreenshotResponse = {
        id,
        status: 'completed',
        screenshots
      };
      
      console.log(`Nodehive full-page screenshots completed successfully for: ${url}`);
      return NextResponse.json(response);
    } catch (error) {
      console.error('Screenshot error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      const response: ScreenshotResponse = {
        id,
        status: 'error',
        error: `Failed to capture full-page screenshots: ${errorMessage}. Please check if the website is accessible.`
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
