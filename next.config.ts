import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/videos/:path*",       // what you call in your frontend
        destination: "http://yogalandtv.com/vid/:path*", // where to fetch from
      },
    ];
  },
};

export default nextConfig;
