export type Locale = "en" | "ar";

export interface ContentItem {
  label: string | number | null;
  en: string | number | null;
  ar: string | number | null;
  extra?: string | number | null;
}

export interface ContentSection {
  title: string;
  items: ContentItem[];
}

export interface PageContent {
  title: string;
  metadata: ContentItem[];
  sections: ContentSection[];
}

export type PageTheme =
  | "home"
  | "editorial"
  | "heritage"
  | "manifesto"
  | "governance"
  | "industrial"
  | "quality"
  | "sustainability"
  | "portfolio"
  | "partnership"
  | "market"
  | "careers"
  | "contact";
