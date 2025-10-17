import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/uploads/job-images/:path*',
        destination: '/api/uploads/job-images/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ];
  },
  serverRuntimeConfig: {
    hostname: '0.0.0.0',
    port: 6500
  }
};

export default nextConfig;
