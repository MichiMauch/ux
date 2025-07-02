// Website Types Index - Centralized exports for all website analysis configurations
import { WebsiteType } from '@/types/analysis';
import { CORPORATE_CATEGORIES, getCorporatePrompt } from './corporate';
import { ECOMMERCE_CATEGORIES, getEcommercePrompt } from './ecommerce';
import { BLOG_CATEGORIES, getBlogPrompt } from './blog';
import { SAAS_CATEGORIES, getSaasPrompt } from './saas';
import { EDUCATION_CATEGORIES, getEducationPrompt } from './education';
import { HEALTHCARE_CATEGORIES, getHealthcarePrompt } from './healthcare';
import { GOVERNMENT_CATEGORIES, getGovernmentPrompt } from './government';
import { NONPROFIT_CATEGORIES, getNonprofitPrompt } from './nog-nonprofit';
import { RESTAURANT_CATEGORIES, getRestaurantPrompt } from './restaurant';
import { PORTFOLIO_CATEGORIES, getPortfolioPrompt } from './portfolio';
import { PERSONAL_CATEGORIES, getPersonalPrompt } from './personal';
import { LANDING_CATEGORIES, getLandingPrompt } from './landingpage';
import { HEATMAP_CATEGORIES, getHeatmapPredictionPrompt } from './heatmap-prediction';

// Export all category arrays
export {
  CORPORATE_CATEGORIES,
  ECOMMERCE_CATEGORIES,
  BLOG_CATEGORIES,
  SAAS_CATEGORIES,
  EDUCATION_CATEGORIES,
  HEALTHCARE_CATEGORIES,
  GOVERNMENT_CATEGORIES,
  NONPROFIT_CATEGORIES,
  RESTAURANT_CATEGORIES,
  PORTFOLIO_CATEGORIES,
  PERSONAL_CATEGORIES,
  LANDING_CATEGORIES,
  HEATMAP_CATEGORIES
};

// Export all prompt functions
export {
  getCorporatePrompt,
  getEcommercePrompt,
  getBlogPrompt,
  getSaasPrompt,
  getEducationPrompt,
  getHealthcarePrompt,
  getGovernmentPrompt,
  getNonprofitPrompt,
  getRestaurantPrompt,
  getPortfolioPrompt,
  getPersonalPrompt,
  getLandingPrompt,
  getHeatmapPredictionPrompt
};

// Helper function to get the appropriate prompt based on website type
export function getPromptForWebsiteType(websiteType: WebsiteType, url: string): string {
  switch (websiteType) {
    case 'corporate':
      return getCorporatePrompt(url);
    case 'ecommerce':
      return getEcommercePrompt(url);
    case 'blog':
      return getBlogPrompt(url);
    case 'saas':
      return getSaasPrompt(url);
    case 'education':
      return getEducationPrompt(url);
    case 'healthcare':
      return getHealthcarePrompt(url);
    case 'government':
      return getGovernmentPrompt(url);
    case 'nonprofit':
      return getNonprofitPrompt(url);
    case 'restaurant':
      return getRestaurantPrompt(url);
    case 'portfolio':
      return getPortfolioPrompt(url);
    case 'personal':
      return getPersonalPrompt(url);
    case 'landingpage':
      return getLandingPrompt(url);
    default:
      throw new Error(`Unknown website type: ${websiteType}`);
  }
}

// Helper function to get categories for a website type
export function getCategoriesForWebsiteType(websiteType: WebsiteType): string[] {
  switch (websiteType) {
    case 'corporate':
      return CORPORATE_CATEGORIES;
    case 'ecommerce':
      return ECOMMERCE_CATEGORIES;
    case 'blog':
      return BLOG_CATEGORIES;
    case 'saas':
      return SAAS_CATEGORIES;
    case 'education':
      return EDUCATION_CATEGORIES;
    case 'healthcare':
      return HEALTHCARE_CATEGORIES;
    case 'government':
      return GOVERNMENT_CATEGORIES;
    case 'nonprofit':
      return NONPROFIT_CATEGORIES;
    case 'restaurant':
      return RESTAURANT_CATEGORIES;
    case 'portfolio':
      return PORTFOLIO_CATEGORIES;
    case 'personal':
      return PERSONAL_CATEGORIES;
    case 'landingpage':
      return LANDING_CATEGORIES;
    default:
      throw new Error(`Unknown website type: ${websiteType}`);
  }
}
