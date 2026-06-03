import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    unoptimized: true, // Disable static optimization for easy sandbox loading
  },

  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
