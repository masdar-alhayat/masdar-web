import type {MetadataRoute} from "next";
import {PAGE_DEFINITIONS} from "@/content/pages";
import {getPathname} from "@/i18n/navigation";
import {routing} from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.masdaralhayat.com";

  return PAGE_DEFINITIONS.flatMap(page => routing.locales.map(locale => ({
    url: `${base}${getPathname({href: page.path, locale})}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: locale === routing.defaultLocale
      ? (page.path === "/" ? 1 : 0.75)
      : (page.path === "/" ? 0.9 : 0.7),
    alternates: {
      languages: {
        en: `${base}${getPathname({href: page.path, locale: "en"})}`,
        ar: `${base}${getPathname({href: page.path, locale: "ar"})}`,
      },
    },
  })));
}
