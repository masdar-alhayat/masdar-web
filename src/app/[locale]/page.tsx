import type {Metadata} from "next";
import {HomePage} from "@/components/pages/HomePage";
import {getPageContent} from "@/content/pages";
import {createPageMetadata} from "@/lib/seo";
import type {Locale} from "@/types/content";

const pageKey = "home" as const;
export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> { const {locale} = await params; return createPageMetadata(pageKey, locale); }
export default async function Page({params}: {params: Promise<{locale: Locale}>}) { const {locale} = await params; const page = getPageContent(pageKey); return <HomePage page={page} locale={locale}/>; }
