import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
      // Proxy for Rollup1 RPC
      {
        source: "/rpc/rollup1/:path*",
        destination: "http://34.45.3.213:8547/:path*",
      },
      // Proxy for Rollup2 RPC
      {
        source: "/rpc/rollup2/:path*",
        destination: "http://34.162.155.134:8547/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        // Apply CORS headers to all routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
