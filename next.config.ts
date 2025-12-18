import type { NextConfig } from "next";

// Config updated
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      }
    ]
  }
};

export default nextConfig;
// Trigger rebuild 4
