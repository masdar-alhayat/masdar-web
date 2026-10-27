import content from "./content.generated.json";
import {researchInnovationContent} from "./research-innovation";
import {marketingPageContent} from "./marketing";
import {fonteContent} from "./fonte-test";
import type {PageContent, PageTheme} from "@/types/content";

export const PAGE_KEYS = {
  home: "HOME PAGE",
  about: "ABOUT MASDAR AL HAYAT",
  groupStory: "GROUP STORY – TAMIMI GROUP",
  visionValues: "VISION, MISSION & VALUES",
  research: "RESEARCH & INNOVATION",
  manufacturing: "MANUFACTURING",
  operations: "OPERATIONS",
  quality: "QUALITY & COMPLIANCE",
  logistics: "LOGISTICS & DISTRIBUTION",
  sales: "SALES",
  marketing: "MARKETING",
  brands: "BRANDS",
  brandPortfolio: "BRAND PORTFOLIO",
  partnerships: "PARTNERSHIPS",
  careers: "CAREERS",
  contact: "CONTACT"
} as const;

export type PageKey = keyof typeof PAGE_KEYS;

export const APPROVED_IMAGES = {
  masdar1: "/assets/images/masdar-1.png",
  masdar2: "/assets/images/masdar-2.png",
  masdar3: "/assets/images/masdar-3.jpeg",
  masdar4: "/assets/images/masdar-4.jpeg",
  masdar5: "/assets/images/masdar-5.jpeg",
  masdar6: "/assets/images/masdar-6.jpeg",
  masdar7: "/assets/images/masdar-7.jpeg",
  masdar8: "/assets/images/masdar-8.jpeg",
  masdar9: "/assets/images/masdar-9.jpeg",
  masdar10: "/assets/images/masdar-10.jpeg",
  masdar11: "/assets/images/masdar-11.jpeg",
  masdar12: "/assets/images/masdar-12.jpeg",
  masdar13: "/assets/images/masdar-13.jpeg",
  masdar14: "/assets/images/masdar-14.jpeg",
  masdar15: "/assets/images/masdar-15.jpeg",
  masdar16: "/assets/images/masdar-16.jpeg",
  masdar17: "/assets/images/masdar-17.jpeg",
} as const;

/**
 * Main page hero images.
 * Change only this object when you want to assign a different approved image
 * to a page hero.
 */
export const PAGE_IMAGES = {
  home: APPROVED_IMAGES.masdar1,
  about: "/assets/images/about-facility-hero-v1.webp",
  groupStory: "/brand/tamimi-group-logo-2026.png",
  visionValues: "/assets/images/masdar-enhanced/masdar_al_hayat_09.png",
  research: "/assets/images/masdar-enhanced/masdar_al_hayat_13.png",
  manufacturing: "/assets/images/masdar-21.jpg",
  operations: "/assets/images/operations/masdar-22-enhanced-v2.webp",
  quality: "/assets/images/masdar-enhanced/masdar_al_hayat_33.png",
  logistics: "/assets/images/masdar-21.jpg",
  sales: "/assets/images/sales-hypermarket-hero-v1.webp",
  marketing: "/assets/images/prod-range-03-clean.png",
  brands: "/assets/images/masdar-enhanced/masdar_al_hayat_35.png",
  brandPortfolio: "/assets/images/masdar-enhanced/masdar_al_hayat_35.png",
  partnerships: "/assets/images/partnerships-hero-v2.png",
  careers: "/assets/images/masdar-enhanced/masdar_al_hayat-43.png",
  contact: "/assets/images/masdar-enhanced/masdar_al_hayat-48.png",
} as const;

export const HOME_IMAGES = {
  glanceSaudiPresence: "/assets/images/glance-saudi-presence-v1.png",
  glanceProductionStrength: "/assets/images/masdar-enhanced/masdar_al_hayat_34.png",
  glanceProductPortfolio: "/assets/images/glance-product-portfolio-v1.png",
  glanceMarketDelivery: "/assets/images/masdar-enhanced/masdar_al_hayat-50.png",
  foodPortfolioBread: "/assets/images/food-portfolio-1.jpg",
  foodPortfolioCake: "/assets/images/food-portfolio-2-clean.png",
  foodPortfolioSauces: "/assets/images/food-portfolio-3-clean.png",
  foodPortfolioReadyMeals: "/assets/images/food-portfolio-4-clean.png",
  foodPortfolioPackaged: "/assets/images/food-portfolio-5-clean.png",
  hero: APPROVED_IMAGES.masdar1,
  whoWeAre: "/assets/images/masdar-enhanced/masdar_al_hayat_01.png",
  manufacturingStrength: "/assets/images/masdar-enhanced/masdar_al_hayat-49.png",
  manufacturingStrengthSecondary: "/assets/images/masdar-enhanced/masdar_al_hayat_02.png",
  qualitySystem: "/assets/images/masdar-enhanced/masdar_al_hayat_03.png",
  careers: "/assets/images/masdar-enhanced/masdar_al_hayat_05.jpeg",
} as const;

export const HOME_VIDEOS = {
  flagshipBrand: "/assets/videos/masdar-video-2.mp4",
} as const;

export const BRAND_LOGOS = {
  tamimiGroup: "/brand/tamimi-group-logo-2026.png",
} as const;

/**
 * Internal section images.
 *
 * The key is the page imageKey from PAGE_DEFINITIONS.
 * The number is the visible section index used by SectionRenderer.
 *
 * Example:
 * about: {
 *   2: APPROVED_IMAGES.masdar15,
 * }
 *
 * Sections not listed here will not receive a fallback image.
 * This prevents accidental repetition.
 */
export const SECTION_IMAGE_MAP: Partial<
  Record<keyof typeof PAGE_IMAGES, Record<number, string>>
> = {
  about: {
    2: "/assets/images/masdar-20.png",
  },
  visionValues: {
    2: "/assets/images/masdar-enhanced/masdar_al_hayat_11.png",
    3: "/assets/images/masdar-enhanced/masdar_al_hayat_10.png",
    4: "/assets/images/masdar-enhanced/masdar_al_hayat_12.png",
  },
  research: {
    2: "/assets/images/masdar-enhanced/masdar_al_hayat_14.png",
    4: "/assets/images/masdar-enhanced/masdar_al_hayat_15.png",
  },
  manufacturing: {
    2: "/assets/images/masdar-enhanced/masdar_al_hayat_17.png",
  },
  operations: {
    2: "/assets/images/operations/masdar-23-enhanced-v1.webp",
    4: "/assets/images/operations/masdar-24-enhanced-v1.webp",
  },
  quality: {
    2: "/assets/images/quality-commitment-v1.png",
  },
  logistics: {
    2: "/assets/images/masdar-enhanced/masdar_al_hayat_25.png",
  },
  sales: {
    2: "/assets/images/sales-customers-enhanced-v1.webp",
  },
  partnerships: {
    2: "/assets/images/masdar-enhanced/masdar_al_hayat-42.png",
  },
  careers: {
    2: "/assets/images/masdar-enhanced/masdar_al_hayat-44.png",
  },
};

export interface PageDefinition {
  key: PageKey;
  path: string;
  theme: PageTheme;
  imageKey: keyof typeof PAGE_IMAGES;
}

export const PAGE_DEFINITIONS: PageDefinition[] = [
  {key: "home", path: "/", theme: "home", imageKey: "home"},
  {key: "about", path: "/about/masdar-al-hayat", theme: "editorial", imageKey: "about"},
  {key: "groupStory", path: "/about/group-story-tamimi-group", theme: "heritage", imageKey: "groupStory"},
  {key: "visionValues", path: "/about/vision-mission-values", theme: "manifesto", imageKey: "visionValues"},
  {key: "research", path: "/research-innovation", theme: "innovation", imageKey: "research"},
  {key: "manufacturing", path: "/capabilities/manufacturing", theme: "industrial", imageKey: "manufacturing"},
  {key: "operations", path: "/capabilities/operations", theme: "operations", imageKey: "operations"},
  {key: "quality", path: "/capabilities/quality-compliance", theme: "quality", imageKey: "quality"},
  {key: "logistics", path: "/capabilities/logistics-distribution", theme: "logistics", imageKey: "logistics"},
  {key: "sales", path: "/capabilities/sales", theme: "sales", imageKey: "sales"},
  {key: "marketing", path: "/capabilities/marketing", theme: "market", imageKey: "marketing"},
  {key: "brands", path: "/brands-partnerships/brands", theme: "portfolio", imageKey: "brands"},
  {key: "brandPortfolio", path: "/brands-partnerships/brands-portfolio", theme: "portfolio", imageKey: "brandPortfolio"},
  {key: "partnerships", path: "/brands-partnerships/partnerships", theme: "partnership", imageKey: "partnerships"},
  {key: "careers", path: "/careers", theme: "careers", imageKey: "careers"},
  {key: "contact", path: "/contact", theme: "contact", imageKey: "contact"}
];

export function getSectionImage(
  imageKey: keyof typeof PAGE_IMAGES,
  sectionIndex: number,
): string {
  return SECTION_IMAGE_MAP[imageKey]?.[sectionIndex] ?? "";
}

export function getPageContent(key: PageKey): PageContent {
  if (key === "brands") return fonteContent;
  if (key === "research") return researchInnovationContent;
  if (key === "marketing") return marketingPageContent;
  return content[PAGE_KEYS[key] as keyof typeof content] as PageContent;
}

export function getPageDefinition(key: PageKey): PageDefinition {
  const definition = PAGE_DEFINITIONS.find((page) => page.key === key);
  if (!definition) throw new Error(`Unknown page key: ${key}`);
  return definition;
}
