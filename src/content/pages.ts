import content from "./content.generated.json";
import type {PageContent, PageTheme} from "@/types/content";

export const PAGE_KEYS = {
  home: "HOME PAGE",
  about: "ABOUT MASDAR AL HAYAT",
  groupStory: "GROUP STORY - TAMIMI GROUP",
  visionValues: "VISION, MISSION & VALUES",
  leadership: "LEADERSHIP & GOVERNANCE",
  manufacturing: "MANUFACTURING & OPERATIONS",
  quality: "QUALITY, FOOD SAFETY & COMPLIAN",
  sustainability: "SUSTAINABILITY & RESPONSIBILITY",
  brands: "BRAND PORTFOLIO",
  partnerships: "BUSINESS PARTNERSHIPS",
  presence: "MARKET PRESENCE & EXHIBITIONS",
  landscape: "MARKET & COMPETITOR LANDSCAPE",
  careers: "CAREERS",
  contact: "CONTACT & CORPORATE OFFICES"
} as const;

export type PageKey = keyof typeof PAGE_KEYS;

export interface PageDefinition {
  key: PageKey;
  path: string;
  theme: PageTheme;
  imageKey: keyof typeof PAGE_IMAGES;
}

export const PAGE_IMAGES = {
  home: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=2200&q=88",
  about: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=2000&q=86",
  heritage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2000&q=86",
  manifesto: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=86",
  governance: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=86",
  industrial: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=2200&q=86",
  quality: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=86",
  sustainability: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=2000&q=86",
  portfolio: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2000&q=86",
  partnership: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=2000&q=86",
  market: "https://images.unsplash.com/photo-1651525670114-2b8117390b28?auto=format&fit=crop&w=2400&q=85",
  careers: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=86",
  contact: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=86"
} as const;


export const SECTION_IMAGES = [
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1800&q=84",
  "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1800&q=84",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1800&q=84",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=84",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1800&q=84",
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=84",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=84",
  "https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=1800&q=84"
] as const;

export const PAGE_DEFINITIONS: PageDefinition[] = [
  {key: "home", path: "/", theme: "home", imageKey: "home"},
  {key: "about", path: "/about/masdar-al-hayat", theme: "editorial", imageKey: "about"},
  {key: "groupStory", path: "/about/group-story-tamimi-group", theme: "heritage", imageKey: "heritage"},
  {key: "visionValues", path: "/about/vision-mission-values", theme: "manifesto", imageKey: "manifesto"},
  {key: "leadership", path: "/leadership-governance", theme: "governance", imageKey: "governance"},
  {key: "manufacturing", path: "/operations-quality/manufacturing-operations", theme: "industrial", imageKey: "industrial"},
  {key: "quality", path: "/operations-quality/quality-food-safety-compliance", theme: "quality", imageKey: "quality"},
  {key: "sustainability", path: "/sustainability-responsibility", theme: "sustainability", imageKey: "sustainability"},
  {key: "brands", path: "/brands-partnerships/brands-portfolio", theme: "portfolio", imageKey: "portfolio"},
  {key: "partnerships", path: "/brands-partnerships/business-partnerships", theme: "partnership", imageKey: "partnership"},
  {key: "presence", path: "/market-presence/exhibitions", theme: "market", imageKey: "market"},
  {key: "landscape", path: "/market-presence/market-landscape", theme: "market", imageKey: "market"},
  {key: "careers", path: "/careers", theme: "careers", imageKey: "careers"},
  {key: "contact", path: "/contact", theme: "contact", imageKey: "contact"}
];

export function getPageContent(key: PageKey): PageContent {
  return content[PAGE_KEYS[key] as keyof typeof content] as PageContent;
}

export function getPageDefinition(key: PageKey): PageDefinition {
  const definition = PAGE_DEFINITIONS.find((page) => page.key === key);
  if (!definition) throw new Error(`Unknown page key: ${key}`);
  return definition;
}
