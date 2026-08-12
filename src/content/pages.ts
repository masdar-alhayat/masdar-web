import content from "./content.generated.json";
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
  brands: "BRANDS",
  partnerships: "PARTNERSHIPS",
  presence: "MARKET PRESENCE & EXHIBITIONS",
  landscape: "MARKET & INDUSTRY LANDSCAPE",
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
  about: APPROVED_IMAGES.masdar2,
  groupStory: "/assets/images/masdar-enhanced/masdar_al_hayat_07.jpg",
  visionValues: "/assets/images/masdar-enhanced/masdar_al_hayat_09.png",
  research: "/assets/images/masdar-enhanced/masdar_al_hayat_13.png",
  manufacturing: "/assets/images/masdar-enhanced/masdar_al_hayat_16.png",
  operations: "/assets/images/masdar-enhanced/masdar_al_hayat_21.png",
  quality: "/assets/images/masdar-enhanced/masdar_al_hayat_33.png",
  logistics: "/assets/images/masdar-enhanced/masdar_al_hayat_24.png",
  brands: "/assets/images/masdar-enhanced/masdar_al_hayat_35.png",
  partnerships: "/assets/images/masdar-enhanced/masdar_al_hayat-41.png",
  presence: APPROVED_IMAGES.masdar12,
  landscape: APPROVED_IMAGES.masdar13,
  careers: "/assets/images/masdar-enhanced/masdar_al_hayat-43.png",
  contact: "/assets/images/masdar-enhanced/masdar_al_hayat-48.png",
} as const;

export const HOME_IMAGES = {
  hero: APPROVED_IMAGES.masdar1,
  whoWeAre: "/assets/images/masdar-enhanced/masdar_al_hayat_01.png",
  manufacturingStrength: "/assets/images/masdar-enhanced/masdar_al_hayat_02.png",
  qualitySystem: "/assets/images/masdar-enhanced/masdar_al_hayat_03.png",
  marketConnection: "/assets/images/masdar-enhanced/masdar_al_hayat04.png",
  careers: "/assets/images/masdar-enhanced/masdar_al_hayat_05.jpeg",
} as const;

export const HOME_VIDEOS = {
  flagshipBrand: "/assets/videos/masdar-video-2.mp4",
} as const;

export const BRAND_LOGOS = {
  tamimiGroup: "/brand/tamimi-group-logo.png",
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
    2: "/assets/images/masdar-enhanced/masdar_al_hayat_06.png",
  },
  groupStory: {
    2: "/assets/images/masdar-enhanced/masdar_al_hayat_08.jpeg",
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
    2: "/assets/images/masdar-enhanced/masdar_al_hayat_22.png",
  },
  quality: {
    2: "/assets/images/masdar-enhanced/masdar_al_hayat_23.png",
  },
  logistics: {
    2: "/assets/images/masdar-enhanced/masdar_al_hayat_25.png",
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
  {key: "brands", path: "/brands-partnerships/brands", theme: "portfolio", imageKey: "brands"},
  {key: "partnerships", path: "/brands-partnerships/partnerships", theme: "partnership", imageKey: "partnerships"},
  {key: "presence", path: "/market-presence/exhibitions", theme: "market", imageKey: "presence"},
  {key: "landscape", path: "/market-presence/industry-landscape", theme: "market", imageKey: "landscape"},
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
  return content[PAGE_KEYS[key] as keyof typeof content] as PageContent;
}

export function getPageDefinition(key: PageKey): PageDefinition {
  const definition = PAGE_DEFINITIONS.find((page) => page.key === key);
  if (!definition) throw new Error(`Unknown page key: ${key}`);
  return definition;
}
