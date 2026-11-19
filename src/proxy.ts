import createMiddleware from "next-intl/middleware";
import type {NextRequest} from "next/server";
import {routing} from "@/i18n/routing";
import {isStagingHost} from "@/lib/environment";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const response = intlMiddleware(request);
  // Keep the staging site out of search results (production hosts never match).
  if (isStagingHost(request.headers.get("x-forwarded-host") ?? request.headers.get("host"))) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]
};
