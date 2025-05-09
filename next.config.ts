import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  serverRuntimeConfig: {
    port: 4002,
  },
};

export default nextConfig;
