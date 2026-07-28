import createNextIntlPlugin from "next-intl/plugin";
import type {NextConfig} from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [{protocol: "https", hostname: "images.unsplash.com"}],
    formats: ["image/avif", "image/webp"]
  },
  poweredByHeader: false,
  reactStrictMode: true
};

export default withNextIntl(nextConfig);
