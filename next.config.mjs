/** @type {import('next').NextConfig} */

// const { createProxyMiddleware } = require('http-proxy-middleware');
import { createProxyMiddleware } from 'http-proxy-middleware';
const nextConfig = {
  images: {
    domains: ["gateway.invescore.mn"], // Add your image domains here
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://gateway.invescore.mn/api-test/:path*", // Proxy to the backend
      },
    ];
  },
};

export default nextConfig;
