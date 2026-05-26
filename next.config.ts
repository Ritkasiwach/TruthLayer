import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow larger request bodies for PDF uploads (50MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  // Empty turbopack config to silence the webpack warning
  turbopack: {},
};

export default nextConfig;
