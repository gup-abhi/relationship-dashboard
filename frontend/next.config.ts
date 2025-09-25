import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 👈 enables static export (replaces `next export`)

  images: {
    unoptimized: true, // 👈 required if you use <Image />
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*", // 👈 proxy to Express
      },
    ];
  },
};

export default nextConfig;
