import type {Metadata} from "next";
import {FontePage} from "@/components/pages/FontePage";
import {createPageMetadata} from "@/lib/seo";
import type {Locale} from "@/types/content";

const pageKey = "brands" as const;
export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> {
  const {locale} = await params;
  const metadata = createPageMetadata(pageKey, locale);
  return {...metadata, openGraph: {...metadata.openGraph, images: [{url: "/assets/images/fonte/product-collection.webp", width: 1386, height: 1254, alt: "Fonte"}]}};
}

export default async function Page({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  return <FontePage locale={locale}/>;
}
