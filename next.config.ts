import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wavyeyqhubtwuhdfugoj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(iframe-entry|panels/:path*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors https://thk-org.onrender.com",
          },
        ],
      },
    ];
  },
};

export default nextConfig;