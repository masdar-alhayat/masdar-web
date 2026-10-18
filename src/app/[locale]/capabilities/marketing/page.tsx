import type {Metadata} from "next";
import {MarketingPage} from "@/components/pages/MarketingPage";
import {createPageMetadata} from "@/lib/seo";
import type {Locale} from "@/types/content";

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> {
  const {locale} = await params;
  return createPageMetadata("marketing", locale);
}

export default async function Page({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  return <MarketingPage locale={locale}/>;
}
