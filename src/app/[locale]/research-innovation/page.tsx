import type {Metadata} from "next";
import {InternalPage} from "@/components/pages/InternalPage";
import {getPageContent, getPageDefinition} from "@/content/pages";
import {createPageMetadata} from "@/lib/seo";
import type {Locale} from "@/types/content";

const pageKey = "research" as const;
export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> { const {locale} = await params; return createPageMetadata(pageKey, locale); }
export default async function Page({params}: {params: Promise<{locale: Locale}>}) { const {locale} = await params; const page = getPageContent(pageKey); const definition = getPageDefinition(pageKey); return <InternalPage page={page} locale={locale} theme={definition.theme} imageKey={definition.imageKey}/>; }
