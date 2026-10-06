import {redirect} from "@/i18n/navigation";
import type {Locale} from "@/types/content";

export default async function Page({params}: {params: Promise<{locale: Locale}>}) { const {locale} = await params; redirect({href: "/market-presence/industry-landscape", locale}); }
