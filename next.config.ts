import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  transpilePackages: ["three"],
  experimental: {
    optimizePackageImports: ["gsap", "framer-motion", "lucide-react"],
  },
};

export default nextConfig;
