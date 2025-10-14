import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    instrumentationHook: false,
    // ensure webpack pipeline
    turbo: false,
  },
};

export default nextConfig;
