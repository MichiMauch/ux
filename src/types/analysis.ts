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
  | 'heatmap-prediction'
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
  // Heatmap-spezifische Eigenschaften (optional)
  heatmapData?: HeatmapPrediction;
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

export interface HeatmapPrediction {
  visualAttentionPrediction: {
    primaryFocusAreas: Array<{
      area: string;
      attentionProbability: 'high' | 'medium' | 'low';
      timeToFirstFixation: '0-3s' | '3-10s' | '10s+';
      dwellTime: 'short' | 'medium' | 'long';
      reasoning: string;
    }>;
    scanPattern: 'F-pattern' | 'Z-pattern' | 'center-out' | 'gutenberg';
    visualHierarchy: string[];
  };
  clickPrediction: {
    highProbabilityAreas: Array<{
      element: string;
      clickProbability: string;
      reasoning: string;
      deviceSpecific: 'desktop' | 'mobile' | 'both';
    }>;
    mediumProbabilityAreas: Array<{
      element: string;
      clickProbability: string;
      reasoning: string;
    }>;
    lowProbabilityAreas: Array<{
      element: string;
      clickProbability: string;
      reasoning: string;
    }>;
  };
  scrollBehaviorPrediction: {
    aboveFoldEngagement: string;
    predictedScrollDepth: {
      '25percent': string;
      '50percent': string;
      '75percent': string;
      '100percent': string;
    };
    scrollTriggers: string[];
    exitPoints: string[];
    averageTimeOnPage: string;
  };
  deviceSpecificInsights: {
    desktop: {
      primaryInteractionPattern: string;
      hoverBehavior: string;
      multiColumnAttention: string;
    };
    mobile: {
      thumbZoneUsage: string;
      scrollVelocity: 'fast' | 'medium' | 'slow';
      touchInteractionPattern: string;
    };
  };
  heatmapSummary: {
    topHotspots: string[];
    coldZones: string[];
    surprisingFindings: string;
    improvementOpportunities: string[];
  };
}
