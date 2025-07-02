import OpenAI from 'openai';
import { WebsiteType, AnalysisCategory } from '@/types/analysis';
import { getPromptForWebsiteType } from './website-types';

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
          role: "system",
          content: "Du bist ein UX-Experte, der Website-Screenshots analysiert. Du erhältst SCREENSHOTS von Websites im BASE64-Format als Bilder und sollst diese anhand der bereitgestellten Kriterien bewerten. Analysiere AUSSCHLIESSLICH das, was in den Screenshots VISUELL SICHTBAR ist. Du analysierst BILDER, nicht externe Websites. Antworte immer im gewünschten JSON-Format basierend auf dem, was du in den bereitgestellten Screenshots sehen kannst."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analysiere die folgenden Screenshots einer Website und bewerte sie nach den angegebenen Kriterien. Du siehst hier Desktop- und Mobile-Screenshots der URL: ${url}. Bewerte nur das, was visuell in den Bildern erkennbar ist.\n\n${prompt}`
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


