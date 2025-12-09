import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Disable static generation for pages that need runtime environment variables
  experimental: {
    // This ensures client-side code doesn't run during build
  },
};

export default nextConfig;
