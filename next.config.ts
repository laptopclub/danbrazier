import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "cdn.sanity.io",
        protocol: "https"
      }
    ]
  },
  transpilePackages: ["@laptopclub/foundation-analytics", "@laptopclub/foundation-cms", "@laptopclub/foundation-ui", "@laptopclub/foundation-config"]
};

export default nextConfig;
