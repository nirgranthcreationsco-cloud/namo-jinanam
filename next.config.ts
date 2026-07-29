import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow framer-motion and other packages
  transpilePackages: [],
  // Performance
  compress: true,
  // Disable strict mode for smoother animations
  reactStrictMode: false,
};

export default nextConfig;
