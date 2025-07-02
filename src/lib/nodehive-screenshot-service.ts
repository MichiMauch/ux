import { Screenshots } from '@/types/analysis';

export class NodehiveScreenshotService {
  private readonly baseUrl = 'https://preview.nodehive.com/api/screenshot';

  async takeScreenshots(url: string): Promise<Screenshots> {
    console.log(`Taking Nodehive full-page screenshots for: ${url}`);
    
    try {
      // Take desktop and mobile screenshots in parallel
      const [desktopScreenshot, mobileScreenshot] = await Promise.all([
        this.captureScreenshot(url, {
          resX: 1920,
          resY: 1080,
          outFormat: 'png',
          waitTime: 3000,
          isFullPage: true,
          dismissModals: true
        }),
        this.captureScreenshot(url, {
          resX: 375,
          resY: 812,
          outFormat: 'png', 
          waitTime: 3000,
          isFullPage: true,
          dismissModals: true
        })
      ]);

      return {
        desktop: desktopScreenshot,
        mobile: mobileScreenshot
      };
    } catch (error) {
      console.error('Nodehive capture failed:', error);
      throw new Error(`Failed to capture full-page screenshots for ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async captureScreenshot(url: string, options: ScreenshotOptions): Promise<string> {
    // Build query parameters for Nodehive API
    const params = new URLSearchParams({
      url: encodeURIComponent(url),
      resX: options.resX.toString(),
      resY: options.resY.toString(),
      outFormat: options.outFormat,
      waitTime: options.waitTime.toString(),
      isFullPage: options.isFullPage.toString(),
      dismissModals: options.dismissModals.toString()
    });

    const requestUrl = `${this.baseUrl}?${params}`;
    
    console.log(`Making Nodehive request for ${options.resX}x${options.resY} (full-page: ${options.isFullPage})`);
    
    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'UX-Analyzer/1.0'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Nodehive API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Nodehive API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType?.startsWith('image/')) {
        const errorText = await response.text();
        console.error(`Nodehive returned non-image content: ${contentType}`, errorText);
        throw new Error(`Nodehive returned non-image content: ${contentType} - ${errorText}`);
      }

      // Convert to base64
      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      
      if (base64.length === 0) {
        throw new Error('Nodehive returned empty image');
      }

      console.log(`Nodehive success: ${base64.length} characters, content-type: ${contentType}`);
      
      // Return PNG format for OpenAI compatibility
      return `data:image/png;base64,${base64}`;
      
    } catch (error) {
      console.error('Nodehive request failed:', error);
      throw error;
    }
  }
}

interface ScreenshotOptions {
  resX: number;
  resY: number;
  outFormat: 'png' | 'jpg';
  waitTime: number;
  isFullPage: boolean;
  dismissModals: boolean;
}
