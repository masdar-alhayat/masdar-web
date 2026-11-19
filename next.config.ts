import createNextIntlPlugin from "next-intl/plugin";
import type {NextConfig} from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isDev = process.env.NODE_ENV !== "production";

// Content Security Policy: only the origins the site actually uses are allowed.
// - Google Fonts (stylesheet + font files) and the Google Maps embed on the Contact page.
// - 'unsafe-inline' scripts/styles are required by Next.js' inline bootstrap scripts and by inline style attributes.
// - Development additionally needs 'unsafe-eval' and websockets for hot reloading.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "frame-src https://www.google.com https://maps.google.com",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  {key: "Content-Security-Policy", value: contentSecurityPolicy},
  // Browsers only honour HSTS over HTTPS; subdomains are deliberately not included.
  {key: "Strict-Transport-Security", value: "max-age=31536000"},
  {key: "X-Frame-Options", value: "SAMEORIGIN"},
  {key: "X-Content-Type-Options", value: "nosniff"},
  {key: "Referrer-Policy", value: "strict-origin-when-cross-origin"},
  {key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()"},
];

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd()
  },
  images: {
    remotePatterns: [{protocol: "https", hostname: "images.unsplash.com"}],
    formats: ["image/avif", "image/webp"]
  },
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{source: "/:path*", headers: securityHeaders}];
  }
};

export default withNextIntl(nextConfig);
