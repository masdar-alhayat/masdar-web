import type {Metadata} from "next";
import {getPageContent, getPageDefinition, type PageKey} from "@/content/pages";
import {meta} from "@/lib/content";
import type {Locale} from "@/types/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.masdaralhayat.com";

export function createPageMetadata(key: PageKey, locale: Locale): Metadata {
  const page = getPageContent(key);
  const definition = getPageDefinition(key);
  const title = meta(page, "Meta Title", locale) || "Masdar Al Hayat for Food Industries";
  const description = meta(page, "Meta Description", locale);
  const localizedPath = locale === "ar" ? `/ar${definition.path === "/" ? "" : definition.path}` : definition.path;
  const canonical = `${SITE_URL}${localizedPath}`;
  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      noarchive: true,
      nosnippet: true,
      noimageindex: true
    },
    alternates: {
      canonical,
      languages: {
        en: `${SITE_URL}${definition.path}`,
        ar: `${SITE_URL}/ar${definition.path === "/" ? "" : definition.path}`,
        "x-default": `${SITE_URL}${definition.path}`
      }
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      url: canonical,
      title,
      description,
      siteName: "Masdar Al Hayat for Food Industries",
      images: [{url: `${SITE_URL}/brand/masdar-logo.png`, width: 1200, height: 630, alt: "Masdar Al Hayat"}]
    },
    twitter: {card: "summary_large_image", title, description}
  };
}
