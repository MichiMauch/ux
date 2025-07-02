export type WebsiteType = 
  | 'corporate' 
  | 'ecommerce' 
  | 'blog' 
  | 'saas' 
  | 'education' 
  | 'healthcare' 
  | 'government' 
  | 'nonprofit' 
  | 'restaurant' 
  | 'portfolio' 
  | 'personal' 
  | 'landingpage';

export type AnalysisType = 
  | 'ux-analysis' 
  | 'accessibility-audit'
  | 'performance-analysis'
  | 'conversion-optimization';

export interface Screenshots {
  desktop: string;
  mobile: string;
}

export interface AnalysisCategory {
  name: string;
  score: number;
  description: string;
  recommendations: string[];
}

export interface AnalysisResult {
  id: string;
  url: string;
  websiteType: WebsiteType;
  analysisType: AnalysisType;
  overallScore: number;
  categories: AnalysisCategory[];
  summary: string;
  timestamp: string;
  screenshots?: Screenshots;
}

export interface ScreenshotRequest {
  url: string;
  websiteType: WebsiteType;
}

export interface ScreenshotResponse {
  id: string;
  status: 'processing' | 'completed' | 'error';
  screenshots?: Screenshots;
  error?: string;
}

export interface AnalysisRequest {
  screenshotId: string;
  websiteType: WebsiteType;
  url: string;
}
