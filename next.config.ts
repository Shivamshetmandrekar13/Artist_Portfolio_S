import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Let phones/tablets on the home network load the dev server (npm run dev:mobile)
  allowedDevOrigins: ["192.168.*.*"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Allow blob: preview URLs in dev
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
