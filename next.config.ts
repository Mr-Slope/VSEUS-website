import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The Services page was renamed to Resources. Keep old links working.
      { source: '/services', destination: '/resources', permanent: true },
      { source: '/services/:path*', destination: '/resources', permanent: true },
    ];
  },
};

export default nextConfig;
