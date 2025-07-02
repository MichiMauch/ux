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
    
    try {
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
      console.error('Screenshot error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Screenshot capture failed for ${url}: ${errorMessage}`);
    }
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
