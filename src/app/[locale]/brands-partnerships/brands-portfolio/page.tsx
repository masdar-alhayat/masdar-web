import {redirect} from "next/navigation";
import type {Locale} from "@/types/content";

export default async function Page({params}: {params: Promise<{locale: Locale}>}) { const {locale} = await params; redirect(locale === "ar" ? "/ar/brands-partnerships/brands" : "/brands-partnerships/brands"); }
