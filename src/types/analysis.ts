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

export interface Lead {
  email: string;
  url: string;
  websiteType: WebsiteType;
}

export interface UXAnalysis {
  score: number;
  details: { category: string; score: number }[];
}

export interface MetaTag {
  tag: string;
  content: string;
  present: boolean;
  group: string;
  recommendation?: string;
}

export interface MetaTagsData {
  score: number;
  total: number;
  present: number;
  missing: number;
  tags: { tag: string; content: string; status: string }[];
}

export interface AnalysisResult {
  id: string;
  lead: Lead;
  data: {
    uxAnalysis: UXAnalysis;
    pageSpeedData: PageSpeedData[];
    metaTagsData: MetaTagsData;
  };
  url: string;
  websiteType: WebsiteType;
  analysisType: AnalysisType;
  overallScore: number;
  categories: AnalysisCategory[];
  summary: string;
  timestamp: string;
  screenshots?: Screenshots;
  analysisId?: number;
}

export interface ScreenshotRequest {
  url: string;
  websiteType: WebsiteType;
}

export interface PageSpeedData {
  desktop?: {
    score: number;
    performance?: number;
    accessibility?: number;
    bestPractices?: number;
    seo?: number;
    metrics: Record<string, number | string>;
  };
  mobile?: {
    score: number;
    performance?: number;
    accessibility?: number;
    bestPractices?: number;
    seo?: number;
    metrics: Record<string, number | string>;
  };
  recommendations?: string[];
}

export interface AnalysisData {
  uxAnalysis?: AnalysisResult;
  pageSpeedData?: PageSpeedData;
  metaTagsData?: MetaTagsData;
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
