import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export interface SocialPreviewData {
  platform: "google" | "twitter" | "facebook" | "linkedin" | "whatsapp";
  title: string;
  description: string;
  image?: string;
  url: string;
  domain: string;
  hasRequiredTags: boolean;
  missingTags: string[];
  recommendations: string[];
}

export interface SocialPreviewResult {
  url: string;
  timestamp: string;
  previews: SocialPreviewData[];
  summary: {
    totalPlatforms: number;
    optimizedPlatforms: number;
    missingOptimization: number;
    overallScore: number;
  };
}

interface MetaTags {
  title?: string;
  description?: string;
  image?: string;
  
  // Open Graph
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  ogSiteName?: string;
  
  // Twitter
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
  
  // Additional
  canonical?: string;
  robots?: string;
}

async function extractMetaTags(url: string): Promise<MetaTags> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const metaTags: MetaTags = {};
    
    // Basic tags
    metaTags.title = $('title').text().trim();
    metaTags.description = $('meta[name="description"]').attr('content')?.trim();
    
    // Open Graph tags
    metaTags.ogTitle = $('meta[property="og:title"]').attr('content')?.trim();
    metaTags.ogDescription = $('meta[property="og:description"]').attr('content')?.trim();
    metaTags.ogImage = $('meta[property="og:image"]').attr('content')?.trim();
    metaTags.ogType = $('meta[property="og:type"]').attr('content')?.trim();
    metaTags.ogUrl = $('meta[property="og:url"]').attr('content')?.trim();
    metaTags.ogSiteName = $('meta[property="og:site_name"]').attr('content')?.trim();
    
    // Twitter tags
    metaTags.twitterCard = $('meta[name="twitter:card"]').attr('content')?.trim();
    metaTags.twitterTitle = $('meta[name="twitter:title"]').attr('content')?.trim();
    metaTags.twitterDescription = $('meta[name="twitter:description"]').attr('content')?.trim();
    metaTags.twitterImage = $('meta[name="twitter:image"]').attr('content')?.trim();
    metaTags.twitterSite = $('meta[name="twitter:site"]').attr('content')?.trim();
    metaTags.twitterCreator = $('meta[name="twitter:creator"]').attr('content')?.trim();
    
    // Additional
    metaTags.canonical = $('link[rel="canonical"]').attr('href')?.trim();
    metaTags.robots = $('meta[name="robots"]').attr('content')?.trim();
    
    // Resolve relative image URLs
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
    
    if (metaTags.ogImage && !metaTags.ogImage.startsWith('http')) {
      metaTags.ogImage = metaTags.ogImage.startsWith('/') 
        ? `${baseUrl}${metaTags.ogImage}`
        : `${baseUrl}/${metaTags.ogImage}`;
    }
    
    if (metaTags.twitterImage && !metaTags.twitterImage.startsWith('http')) {
      metaTags.twitterImage = metaTags.twitterImage.startsWith('/') 
        ? `${baseUrl}${metaTags.twitterImage}`
        : `${baseUrl}/${metaTags.twitterImage}`;
    }
    
    return metaTags;
    
  } catch (error) {
    console.error('Error extracting meta tags:', error);
    throw new Error(`Failed to extract meta tags: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function generateGooglePreview(tags: MetaTags, url: string, domain: string): SocialPreviewData {
  const title = tags.title || tags.ogTitle || "Unbenannte Seite";
  const description = tags.description || tags.ogDescription || "Keine Beschreibung verfügbar";
  
  const missingTags: string[] = [];
  const recommendations: string[] = [];
  
  if (!tags.title) {
    missingTags.push("Title Tag");
    recommendations.push("Fügen Sie einen aussagekräftigen <title> Tag hinzu (50-60 Zeichen optimal)");
  } else if (tags.title.length > 60) {
    recommendations.push("Kürzen Sie den Title Tag auf unter 60 Zeichen");
  }
  
  if (!tags.description) {
    missingTags.push("Meta Description");
    recommendations.push("Fügen Sie eine Meta Description hinzu (150-160 Zeichen optimal)");
  } else if (tags.description.length > 160) {
    recommendations.push("Kürzen Sie die Meta Description auf unter 160 Zeichen");
  }
  
  if (!tags.canonical) {
    recommendations.push("Fügen Sie einen Canonical Link hinzu um Duplicate Content zu vermeiden");
  }
  
  const hasRequiredTags = tags.title && tags.description;
  
  return {
    platform: "google",
    title: title.substring(0, 60),
    description: description.substring(0, 160),
    url,
    domain,
    hasRequiredTags: !!hasRequiredTags,
    missingTags,
    recommendations
  };
}

function generateTwitterPreview(tags: MetaTags, url: string, domain: string): SocialPreviewData {
  const title = tags.twitterTitle || tags.ogTitle || tags.title || "Unbenannte Seite";
  const description = tags.twitterDescription || tags.ogDescription || tags.description || "Keine Beschreibung verfügbar";
  const image = tags.twitterImage || tags.ogImage;
  
  const missingTags: string[] = [];
  const recommendations: string[] = [];
  
  if (!tags.twitterCard) {
    missingTags.push("twitter:card");
    recommendations.push("Fügen Sie <meta name=\"twitter:card\" content=\"summary_large_image\"> hinzu");
  }
  
  if (!tags.twitterTitle && !tags.ogTitle && !tags.title) {
    missingTags.push("twitter:title");
    recommendations.push("Fügen Sie einen twitter:title Meta Tag hinzu");
  }
  
  if (!tags.twitterDescription && !tags.ogDescription && !tags.description) {
    missingTags.push("twitter:description");
    recommendations.push("Fügen Sie einen twitter:description Meta Tag hinzu");
  }
  
  if (!tags.twitterImage && !tags.ogImage) {
    missingTags.push("twitter:image");
    recommendations.push("Fügen Sie ein twitter:image hinzu (mindestens 1200x630 Pixel empfohlen)");
  }
  
  if (!tags.twitterSite) {
    recommendations.push("Fügen Sie twitter:site hinzu mit Ihrem Twitter-Handle");
  }
  
  const hasRequiredTags = (tags.twitterCard || tags.ogImage) && 
                         (tags.twitterTitle || tags.ogTitle || tags.title) && 
                         (tags.twitterDescription || tags.ogDescription || tags.description);
  
  return {
    platform: "twitter",
    title,
    description,
    image,
    url,
    domain,
    hasRequiredTags: !!hasRequiredTags,
    missingTags,
    recommendations
  };
}

function generateFacebookPreview(tags: MetaTags, url: string, domain: string): SocialPreviewData {
  const title = tags.ogTitle || tags.title || "Unbenannte Seite";
  const description = tags.ogDescription || tags.description || "Keine Beschreibung verfügbar";
  const image = tags.ogImage;
  
  const missingTags: string[] = [];
  const recommendations: string[] = [];
  
  if (!tags.ogTitle) {
    missingTags.push("og:title");
    recommendations.push("Fügen Sie <meta property=\"og:title\" content=\"Ihr Titel\"> hinzu");
  }
  
  if (!tags.ogDescription) {
    missingTags.push("og:description");
    recommendations.push("Fügen Sie <meta property=\"og:description\" content=\"Ihre Beschreibung\"> hinzu");
  }
  
  if (!tags.ogImage) {
    missingTags.push("og:image");
    recommendations.push("Fügen Sie ein og:image hinzu (mindestens 1200x630 Pixel empfohlen)");
  }
  
  if (!tags.ogType) {
    missingTags.push("og:type");
    recommendations.push("Fügen Sie <meta property=\"og:type\" content=\"website\"> hinzu");
  }
  
  if (!tags.ogUrl) {
    missingTags.push("og:url");
    recommendations.push("Fügen Sie <meta property=\"og:url\" content=\"Ihre URL\"> hinzu");
  }
  
  if (!tags.ogSiteName) {
    recommendations.push("Fügen Sie og:site_name hinzu für bessere Branding");
  }
  
  const hasRequiredTags = tags.ogTitle && tags.ogDescription && tags.ogImage && tags.ogType;
  
  return {
    platform: "facebook",
    title,
    description,
    image,
    url,
    domain,
    hasRequiredTags: !!hasRequiredTags,
    missingTags,
    recommendations
  };
}

function generateLinkedInPreview(tags: MetaTags, url: string, domain: string): SocialPreviewData {
  const title = tags.ogTitle || tags.title || "Unbenannte Seite";
  const description = tags.ogDescription || tags.description || "Keine Beschreibung verfügbar";
  const image = tags.ogImage;
  
  const missingTags: string[] = [];
  const recommendations: string[] = [];
  
  // LinkedIn verwendet hauptsächlich Open Graph Tags
  if (!tags.ogTitle) {
    missingTags.push("og:title");
    recommendations.push("LinkedIn nutzt Open Graph Tags - fügen Sie og:title hinzu");
  }
  
  if (!tags.ogDescription) {
    missingTags.push("og:description");
    recommendations.push("Fügen Sie og:description für LinkedIn-Optimierung hinzu");
  }
  
  if (!tags.ogImage) {
    missingTags.push("og:image");
    recommendations.push("Fügen Sie og:image hinzu (1200x627 Pixel optimal für LinkedIn)");
  }
  
  if (!tags.ogType) {
    missingTags.push("og:type");
    recommendations.push("Fügen Sie og:type hinzu (meist 'article' oder 'website')");
  }
  
  const hasRequiredTags = tags.ogTitle && tags.ogDescription && tags.ogImage;
  
  return {
    platform: "linkedin",
    title,
    description,
    image,
    url,
    domain,
    hasRequiredTags: !!hasRequiredTags,
    missingTags,
    recommendations
  };
}

function generateWhatsAppPreview(tags: MetaTags, url: string, domain: string): SocialPreviewData {
  const title = tags.ogTitle || tags.title || "Unbenannte Seite";
  const description = tags.ogDescription || tags.description || "Keine Beschreibung verfügbar";
  const image = tags.ogImage;
  
  const missingTags: string[] = [];
  const recommendations: string[] = [];
  
  // WhatsApp verwendet Open Graph Tags
  if (!tags.ogTitle) {
    missingTags.push("og:title");
    recommendations.push("WhatsApp nutzt Open Graph - fügen Sie og:title hinzu");
  }
  
  if (!tags.ogDescription) {
    missingTags.push("og:description");
    recommendations.push("Fügen Sie og:description für WhatsApp-Vorschau hinzu");
  }
  
  if (!tags.ogImage) {
    missingTags.push("og:image");
    recommendations.push("Fügen Sie og:image hinzu für WhatsApp-Vorschau (300x300 Pixel minimal)");
  }
  
  const hasRequiredTags = tags.ogTitle && tags.ogDescription && tags.ogImage;
  
  return {
    platform: "whatsapp",
    title,
    description,
    image,
    url,
    domain,
    hasRequiredTags: !!hasRequiredTags,
    missingTags,
    recommendations
  };
}

async function generateSocialPreviews(url: string): Promise<SocialPreviewResult> {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    const tags = await extractMetaTags(url);
    
    const previews: SocialPreviewData[] = [
      generateGooglePreview(tags, url, domain),
      generateTwitterPreview(tags, url, domain),
      generateFacebookPreview(tags, url, domain),
      generateLinkedInPreview(tags, url, domain),
      generateWhatsAppPreview(tags, url, domain)
    ];
    
    const totalPlatforms = previews.length;
    const optimizedPlatforms = previews.filter(p => p.hasRequiredTags).length;
    const missingOptimization = totalPlatforms - optimizedPlatforms;
    const overallScore = Math.round((optimizedPlatforms / totalPlatforms) * 100);
    
    return {
      url,
      timestamp: new Date().toISOString(),
      previews,
      summary: {
        totalPlatforms,
        optimizedPlatforms,
        missingOptimization,
        overallScore
      }
    };
    
  } catch (error) {
    console.error('Error generating social previews:', error);
    throw new Error(`Failed to generate social previews: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }
    
    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }
    
    const result = await generateSocialPreviews(url);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Social preview API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate social media previews',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}