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
  masdar1: "/assets/images/heroes/masdar-1.png",
} as const;

/**
 * Main page hero images.
 * Change only this object when you want to assign a different approved image
 * to a page hero.
 */
export const PAGE_IMAGES = {
  home: APPROVED_IMAGES.masdar1,
  about: "/assets/images/about/about-facility-hero-v1.webp",
  groupStory: "/brand/tamimi-group-logo-2026.png",
  visionValues: "/assets/images/masdar-enhanced/masdar_al_hayat_09.png",
  research: "/assets/images/masdar-enhanced/masdar_al_hayat_13.png",
  manufacturing: "/assets/images/heroes/masdar-20.png",
  operations: "/assets/images/capabilities/operations/masdar-22-enhanced-v2.webp",
  quality: "/assets/images/masdar-enhanced/masdar_al_hayat_33.png",
  logistics: "/assets/images/heroes/masdar-21.jpg",
  sales: "/assets/images/masdar-enhanced/masdar-web-51.png",
  marketing: "/assets/images/products/prod-range-03-clean.png",
  brands: "/assets/images/masdar-enhanced/masdar_al_hayat_35.png",
  brandPortfolio: "/assets/images/heroes/brand-portfolio-hero.webp",
  partnerships: "/assets/images/heroes/partnerships-hero-v2.png",
  careers: "/assets/images/masdar-enhanced/masdar_al_hayat-43.png",
  contact: "/assets/images/heroes/contact-hero.webp",
} as const;

export const HOME_IMAGES = {
  glanceSaudiPresence: "/assets/images/home/glance-saudi-presence-v1.png",
  glanceInstitutionalStrength: "/assets/images/masdar-enhanced/masdar_al_hayat_07.jpg",
  glanceProductionStrength: "/assets/images/home/glance-production-strength-fonte.webp",
  glanceProductPortfolio: "/assets/images/home/glance-product-portfolio-v1.png",
  glanceMarketDelivery: "/assets/images/masdar-enhanced/masdar_al_hayat-50.png",
  foodPortfolioBread: "/assets/images/home/food-portfolio-1.jpg",
  foodPortfolioCake: "/assets/images/home/food-portfolio-2-clean.png",
  foodPortfolioSauces: "/assets/images/home/food-portfolio-3-clean.png",
  foodPortfolioReadyMeals: "/assets/images/home/food-portfolio-4-clean.png",
  foodPortfolioPackaged: "/assets/images/home/food-portfolio-5-clean.png",
  hero: APPROVED_IMAGES.masdar1,
  whoWeAre: "/assets/images/masdar-enhanced/masdar_al_hayat_01.png",
  manufacturingStrength: "/assets/images/masdar-enhanced/masdar_al_hayat-49.png",
  manufacturingStrengthSecondary: "/assets/images/masdar-enhanced/masdar_al_hayat_02.png",
  workingTogetherRetail: "/assets/images/home/working-together-retail.webp",
  workingTogetherFoodservice: "/assets/images/home/working-together-foodservice.webp",
  workingTogetherDistribution: "/assets/images/home/working-together-distribution.webp",
  workingTogetherInstitutional: "/assets/images/home/working-together-institutional.webp",
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
 *   2: "/assets/images/heroes/masdar-20.png",
 * }
 *
 * Sections not listed here will not receive a fallback image.
 * This prevents accidental repetition.
 */
export const SECTION_IMAGE_MAP: Partial<
  Record<keyof typeof PAGE_IMAGES, Record<number, string>>
> = {
  about: {
    2: "/assets/images/heroes/masdar-20.png",
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
    2: "/assets/images/capabilities/operations/masdar-23-enhanced-v1.webp",
    4: "/assets/images/capabilities/operations/masdar-24-enhanced-v1.webp",
  },
  quality: {
    2: "/assets/images/capabilities/quality-commitment-v1.png",
  },
  logistics: {
    2: "/assets/images/masdar-enhanced/masdar_al_hayat_25.png",
  },
  sales: {
    2: "/assets/images/capabilities/sales-customers-enhanced-v1.webp",
  },
  partnerships: {
    2: "/assets/images/masdar-enhanced/masdar_al_hayat-42.png",
  },
  careers: {
    2: "/assets/images/masdar-enhanced/masdar_al_hayat-44.png",
  },
};

// Production photographs shown as an overlapping collage in the About hero, in tile order.
export const ABOUT_HERO_GALLERY = [
  {src: "/assets/images/about/production-tortilla-pressing.webp", alt: {en: "Tortilla dough discs pressed and placed on a production belt", ar: "أقراص عجين التورتيلا تُكبس وتوضع على سير الإنتاج"}},
  {src: "/assets/images/about/production-tortilla-dividing.webp", alt: {en: "Dough portions moving through an automated sheeting line", ar: "قطع العجين تمر عبر خط تشكيل آلي"}},
  {src: "/assets/images/about/production-dough-rounding.webp", alt: {en: "Rounded dough balls on an automated rounding conveyor", ar: "كرات العجين على سير التكوير الآلي"}},
  {src: "/assets/images/about/production-swiss-roll-sheets.webp", alt: {en: "Sponge sheets layered with filling before rolling", ar: "طبقات الكيك الإسفنجي مع الحشوة قبل اللف"}},
  {src: "/assets/images/about/production-tomato-paste-line.webp", alt: {en: "Fonte tomato paste packs on a coding and conveyor line", ar: "عبوات معجون الطماطم فونتي على خط الترميز والنقل"}},
  {src: "/assets/images/about/production-swiss-roll-line.webp", alt: {en: "Decorated Swiss rolls moving along a packing conveyor", ar: "لفائف السويس رول المزينة على سير التعبئة"}},
] as const;

// Vision, Mission & Values hero collage: production, packing, storage and delivery, in tile order.
export const VISION_HERO_GALLERY = [
  {src: "/assets/images/masdar-enhanced/masdar_al_hayat-45.png", alt: {en: "Production team checking burger buns along the conveyor line", ar: "فريق الإنتاج يتابع خبز البرغر على خط النقل"}},
  {src: "/assets/images/masdar-enhanced/masdar_al_hayat_31.png", alt: {en: "Packed Fonte bread being prepared for dispatch", ar: "تجهيز خبز فونتي المعبأ للشحن"}},
  {src: "/assets/images/heroes/masdar-20.png", alt: {en: "Freshly baked buns moving through the spiral cooling tower", ar: "خبز طازج يمر عبر برج التبريد الحلزوني"}},
  {src: "/assets/images/capabilities/operations/masdar-23-enhanced-v1.webp", alt: {en: "Organised warehouse racks of raw materials and finished goods", ar: "رفوف مستودع منظمة للمواد الخام والمنتجات النهائية"}},
  {src: "/assets/images/masdar-enhanced/masdar_al_hayat_02.png", alt: {en: "Masdar Al Hayat refrigerated delivery fleet", ar: "أسطول التوصيل المبرد لمصدر الحياة"}},
] as const;

export const HERO_GALLERIES: Partial<Record<keyof typeof PAGE_IMAGES, readonly {src: string; alt: {en: string; ar: string}}[]>> = {
  about: ABOUT_HERO_GALLERY,
  visionValues: VISION_HERO_GALLERY,
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
