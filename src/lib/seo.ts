import type {Metadata} from "next";
import {getPageContent, getPageDefinition, type PageKey} from "@/content/pages";
import {meta} from "@/lib/content";
import type {Locale} from "@/types/content";
import {getPathname} from "@/i18n/navigation";
import {routing} from "@/i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.masdaralhayat.com";

export function createPageMetadata(key: PageKey, locale: Locale): Metadata {
  const page = getPageContent(key);
  const definition = getPageDefinition(key);
  const title = meta(page, "Meta Title", locale) || "Masdar Al Hayat for Food Industries";
  const description = meta(page, "Meta Description", locale);
  const localizedPath = getPathname({href: definition.path, locale});
  const canonical = `${SITE_URL}${localizedPath}`;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${SITE_URL}${getPathname({href: definition.path, locale: "en"})}`,
        ar: `${SITE_URL}${getPathname({href: definition.path, locale: "ar"})}`,
        "x-default": `${SITE_URL}${getPathname({href: definition.path, locale: routing.defaultLocale})}`
      }
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      url: canonical,
      title,
      description,
      siteName: "Masdar Al Hayat for Food Industries",
      images: [{url: `${SITE_URL}/brand/masdar-logo-text.png`, width: 1842, height: 854, alt: "Masdar Al Hayat"}]
    },
    twitter: {card: "summary_large_image", title, description}
  };
}
