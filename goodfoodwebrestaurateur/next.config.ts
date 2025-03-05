import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  serverRuntimeConfig: {
    port: 4002,
  },
};

export default nextConfig;
