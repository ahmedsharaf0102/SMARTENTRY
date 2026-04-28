import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output only for Docker (not Vercel)
  ...(process.env.DOCKER_BUILD === 'true' ? { output: "standalone" } : {}),

  // Image optimization
  images: {
    unoptimized: false,
  },

  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "/api",
    NEXT_PUBLIC_BINANCE_AFFILIATE_REF: process.env.NEXT_PUBLIC_BINANCE_AFFILIATE_REF || "",
  },
};

export default nextConfig;
