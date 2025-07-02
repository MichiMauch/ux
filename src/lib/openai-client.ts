import OpenAI from 'openai';
import { WebsiteType, AnalysisCategory, HeatmapPrediction } from '@/types/analysis';
import { getPromptForWebsiteType } from './website-types';
import { getHeatmapPredictionPrompt } from './website-types/heatmap-prediction';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeWithOpenAI(
  screenshots: { desktop: string; mobile: string },
  websiteType: WebsiteType,
  url: string
): Promise<{ overallScore: number; categories: AnalysisCategory[]; summary: string }> {
  const prompt = getPromptForWebsiteType(websiteType, url);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: screenshots.desktop,
                detail: "high"
              }
            },
            {
              type: "image_url",
              image_url: {
                url: screenshots.mobile,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 3000,
      temperature: 0.1
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    console.log('OpenAI response content:', content.substring(0, 500) + '...');

    // Parse JSON response - handle markdown code blocks
    const result = parseJSONFromResponse(content);
    
    return {
      overallScore: result.overallScore,
      categories: result.categories,
      summary: result.summary
    };
  } catch (error) {
    console.error('OpenAI analysis error:', error);
    throw new Error('Failed to analyze screenshots with AI');
  }
}

export async function analyzeHeatmapPrediction(
  screenshots: { desktop: string; mobile: string },
  websiteType: WebsiteType,
  url: string
): Promise<HeatmapPrediction> {
  const prompt = getHeatmapPredictionPrompt(url, websiteType);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: screenshots.desktop,
                detail: "high"
              }
            },
            {
              type: "image_url",
              image_url: {
                url: screenshots.mobile,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 4000,
      temperature: 0.1
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    console.log('OpenAI heatmap response content:', content.substring(0, 200) + '...');

    // Check for content filter rejection
    if (content.includes("I'm sorry, I can't assist") || 
        content.includes("I cannot") || 
        content.includes("I'm unable to")) {
      console.log('OpenAI content filter triggered, generating fallback heatmap');
      return generateFallbackHeatmap();
    }

    // Parse JSON response for heatmap prediction
    const result = parseHeatmapJSONFromResponse(content);
    
    return result;
  } catch (error) {
    console.error('OpenAI heatmap analysis error:', error);
    throw new Error('Failed to analyze heatmap prediction with AI');
  }
}

// Helper function to extract Heatmap JSON from markdown code blocks or plain text
function parseHeatmapJSONFromResponse(content: string): HeatmapPrediction {
  try {
    // First try to parse as plain JSON
    return JSON.parse(content) as HeatmapPrediction;
  } catch {
    // If that fails, try to extract JSON from markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1].trim()) as HeatmapPrediction;
      } catch (e) {
        console.error('Failed to parse Heatmap JSON from code block:', jsonMatch[1]);
        throw e;
      }
    }
    
    // If no code block found, try to find JSON-like content
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const jsonContent = content.substring(jsonStart, jsonEnd + 1);
      console.log('Extracted Heatmap JSON content:', jsonContent.substring(0, 200) + '...');
      try {
        return JSON.parse(jsonContent) as HeatmapPrediction;
      } catch (e) {
        console.error('Failed to parse extracted Heatmap JSON:', jsonContent);
        throw e;
      }
    }
    
    throw new Error('No valid Heatmap JSON found in response');
  }
}

// Helper function to extract JSON from markdown code blocks or plain text
function parseJSONFromResponse(content: string): {
  overallScore: number;
  categories: Array<{
    name: string;
    score: number;
    description: string;
    recommendations: string[];
  }>;
  summary: string;
} {
  try {
    // First try to parse as plain JSON
    return JSON.parse(content);
  } catch {
    // If that fails, try to extract JSON from markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch (e) {
        console.error('Failed to parse JSON from code block:', jsonMatch[1]);
        throw e;
      }
    }
    
    // If no code block found, try to find JSON-like content
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const jsonContent = content.substring(jsonStart, jsonEnd + 1);
      console.log('Extracted JSON content:', jsonContent.substring(0, 200) + '...');
      try {
        return JSON.parse(jsonContent);
      } catch (e) {
        console.error('Failed to parse extracted JSON:', jsonContent);
        throw e;
      }
    }
    
    throw new Error('No valid JSON found in response');
  }
}

// Fallback Heatmap generation when OpenAI content filter triggers
function generateFallbackHeatmap(): HeatmapPrediction {
  const baseAreas = [
    { area: "header navigation", attentionProbability: "high" as const, timeToFirstFixation: "0-3s" as const, dwellTime: "short" as const, reasoning: "Navigation is typically the first area users scan" },
    { area: "main headline", attentionProbability: "high" as const, timeToFirstFixation: "0-3s" as const, dwellTime: "medium" as const, reasoning: "Headlines capture immediate attention" },
    { area: "primary call-to-action", attentionProbability: "high" as const, timeToFirstFixation: "3-10s" as const, dwellTime: "medium" as const, reasoning: "CTAs are designed to attract user action" },
    { area: "hero image", attentionProbability: "medium" as const, timeToFirstFixation: "0-3s" as const, dwellTime: "long" as const, reasoning: "Visual elements draw initial attention" },
    { area: "footer", attentionProbability: "low" as const, timeToFirstFixation: "10s+" as const, dwellTime: "short" as const, reasoning: "Footer receives minimal attention in typical browsing" }
  ];

  const baseHighClickAreas = [
    { element: "main navigation menu", clickProbability: "85%", reasoning: "Large targets, easily accessible", deviceSpecific: "both" as const },
    { element: "primary CTA button", clickProbability: "90%", reasoning: "Prominent placement and size", deviceSpecific: "both" as const },
    { element: "logo", clickProbability: "75%", reasoning: "Standard location, medium size", deviceSpecific: "both" as const }
  ];

  const baseMediumClickAreas = [
    { element: "secondary navigation", clickProbability: "65%", reasoning: "Smaller targets, less prominent" },
    { element: "social media links", clickProbability: "60%", reasoning: "Small targets, variable placement" }
  ];

  return {
    visualAttentionPrediction: {
      primaryFocusAreas: baseAreas,
      scanPattern: "F-pattern",
      visualHierarchy: ["header navigation", "main headline", "hero image", "primary call-to-action", "footer"]
    },
    clickPrediction: {
      highProbabilityAreas: baseHighClickAreas,
      mediumProbabilityAreas: baseMediumClickAreas,
      lowProbabilityAreas: []
    },
    scrollBehaviorPrediction: {
      aboveFoldEngagement: "85%",
      predictedScrollDepth: {
        "25percent": "70%",
        "50percent": "45%",
        "75percent": "25%",
        "100percent": "15%"
      },
      scrollTriggers: ["hero section end", "content sections"],
      exitPoints: ["before footer", "mid-page content"],
      averageTimeOnPage: "2-3 minutes"
    },
    deviceSpecificInsights: {
      desktop: {
        primaryInteractionPattern: "cursor-based navigation with hover states",
        hoverBehavior: "frequent hover interactions for exploration",
        multiColumnAttention: "users scan across multiple columns simultaneously"
      },
      mobile: {
        thumbZoneUsage: "70% of interactions occur in thumb-friendly zones",
        scrollVelocity: "medium" as const,
        touchInteractionPattern: "thumb-driven navigation with touch gestures"
      }
    },
    heatmapSummary: {
      topHotspots: ["navigation area", "primary CTA", "main headline"],
      coldZones: ["footer", "sidebar elements", "fine print"],
      surprisingFindings: "Standard fallback analysis - actual insights would require website-specific analysis",
      improvementOpportunities: ["improve CTA visibility", "optimize mobile navigation", "enhance visual hierarchy"]
    }
  };
}
