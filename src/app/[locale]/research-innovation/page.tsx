import type {Metadata} from "next";
import {ResearchInnovationPage} from "@/components/pages/ResearchInnovationPage";
import {createPageMetadata} from "@/lib/seo";
import type {Locale} from "@/types/content";

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> {
  const {locale} = await params;
  return createPageMetadata("research", locale);
}

export default async function Page({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  return <ResearchInnovationPage locale={locale}/>;
}
