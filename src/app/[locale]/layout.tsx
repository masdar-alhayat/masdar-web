/* eslint-disable @next/next/no-page-custom-font */
import type {Metadata} from "next";
import {NextIntlClientProvider, hasLocale} from "next-intl";
import {notFound} from "next/navigation";
import {setRequestLocale} from "next-intl/server";
import {Header} from "@/components/layout/Header";
import {Footer} from "@/components/layout/Footer";
import {routing} from "@/i18n/routing";
import type {Locale} from "@/types/content";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://masdarksa.cloud"),
  title: {default: "Masdar Al Hayat for Food Industries", template: "%s"},
  description: "A Saudi food manufacturing and distribution company operating as part of Tamimi Group.",
  icons: {icon: "/brand/masdar-logo.png"},
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

export function generateStaticParams() { return routing.locales.map(locale => ({locale})); }

export default async function LocaleLayout({children, params}: Readonly<{children: React.ReactNode; params: Promise<{locale: string}>}>) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  return <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet"/></head><body><a className="skip-link" href="#main-content">{locale === "ar" ? "تخطَّ إلى المحتوى" : "Skip to content"}</a><NextIntlClientProvider><Header locale={typedLocale}/>{children}<Footer locale={typedLocale}/></NextIntlClientProvider></body></html>;
}
