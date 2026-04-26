import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: "standalone",

  // Image optimization
  images: {
    unoptimized: true, // For static export compatibility
  },

  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "/api",
    NEXT_PUBLIC_BINANCE_AFFILIATE_REF: process.env.NEXT_PUBLIC_BINANCE_AFFILIATE_REF || "",
  },
};

export default nextConfig;
