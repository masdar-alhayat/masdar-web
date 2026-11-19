import type {MetadataRoute} from "next";
import {headers} from "next/headers";
import {isStagingHost} from "@/lib/environment";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.masdaralhayat.com";
  const requestHeaders = await headers();
  // Staging must never be crawled; production keeps the normal rules.
  if (isStagingHost(requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host"))) {
    return {rules: {userAgent: "*", disallow: "/"}};
  }
  return {rules: {userAgent: "*", allow: "/", disallow: ["/api/", "/_next/"]}, sitemap: `${base}/sitemap.xml`};
}
