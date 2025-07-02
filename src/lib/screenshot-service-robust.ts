import puppeteer, { Browser } from 'puppeteer';
import { Screenshots } from '@/types/analysis';

export class ScreenshotService {
  private browser: Browser | null = null;

  async init() {
    if (!this.browser) {
      try {
        console.log('Initializing Puppeteer browser...');
        this.browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-gpu',
            '--no-first-run',
            '--no-zygote',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
          ],
          timeout: 30000
        });
        console.log('Puppeteer browser initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Puppeteer:', error);
        throw new Error(`Browser initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  async takeScreenshots(url: string): Promise<Screenshots> {
    console.log(`Taking screenshots for: ${url}`);
    
    // Try up to 3 times with browser restart
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Screenshot attempt ${attempt}/3`);
        
        // Force browser restart on retries
        if (attempt > 1) {
          console.log('Restarting browser for retry...');
          await this.close();
          this.browser = null;
        }
        
        await this.init();
        
        if (!this.browser) {
          throw new Error('Browser not initialized');
        }

        const page = await this.browser.newPage();
        
        try {
          // Set user agent to avoid bot detection
          await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
          
          // Basic navigation with extended timeout
          console.log('Navigating to URL...');
          await page.goto(url, { 
            waitUntil: 'networkidle2', 
            timeout: 60000 
          });
          
          // Wait for page to fully render
          await this.delay(2000);
          
          console.log('Page loaded, taking desktop screenshot...');
          // Desktop screenshot
          await page.setViewport({ width: 1920, height: 1080 });
          await this.delay(1000);
          
          const desktopScreenshot = await page.screenshot({
            encoding: 'base64',
            type: 'jpeg',
            quality: 85,
            fullPage: true
          }) as string;

          console.log('Taking mobile screenshot...');
          // Mobile screenshot
          await page.setViewport({ width: 375, height: 667 });
          await this.delay(1000);
          
          const mobileScreenshot = await page.screenshot({
            encoding: 'base64',
            type: 'jpeg',
            quality: 85,
            fullPage: true
          }) as string;

          console.log('Screenshots completed successfully');
          return {
            desktop: `data:image/jpeg;base64,${desktopScreenshot}`,
            mobile: `data:image/jpeg;base64,${mobileScreenshot}`
          };
        } finally {
          await page.close();
        }
      } catch (error) {
        console.error(`Screenshot attempt ${attempt} failed:`, error);
        
        if (attempt === 3) {
          // Last attempt failed, use fallback
          console.log('All screenshot attempts failed, using fallback');
          return this.createFallbackScreenshots(url);
        }
        
        // Wait before retry
        await this.delay(1000 * attempt);
      }
    }
    
    // This should never be reached, but TypeScript requires it
    throw new Error('All screenshot attempts failed');
  }

  private createFallbackScreenshots(url: string): Screenshots {
    const createFallbackSVG = (width: number, height: number, device: string) => {
      const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f8fafc"/>
          <rect x="0" y="0" width="100%" height="80" fill="#1e293b"/>
          <text x="50%" y="45" text-anchor="middle" font-family="Arial" font-size="18" fill="white">
            ${device} - Screenshot Fallback
          </text>
          <text x="50%" y="${height/2}" text-anchor="middle" font-family="Arial" font-size="16" fill="#64748b">
            ${url}
          </text>
          <text x="50%" y="${height/2 + 30}" text-anchor="middle" font-family="Arial" font-size="12" fill="#94a3b8">
            Screenshots temporarily unavailable
          </text>
          <text x="50%" y="${height/2 + 50}" text-anchor="middle" font-family="Arial" font-size="12" fill="#94a3b8">
            Analysis will continue with mock data
          </text>
        </svg>
      `;
      return `data:image/svg+xml;base64,${btoa(svg)}`;
    };

    return {
      desktop: createFallbackSVG(1920, 1080, 'Desktop'),
      mobile: createFallbackSVG(390, 844, 'Mobile')
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const screenshotService = new ScreenshotService();
