/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_DAILY_API_KEY:
      process.env.NEXT_DAILY_API_KEY ||
      "5e8117ad22bcc80c89a3d3a0cd95434292fffa1e131ab4db720b8b91d3c64acb",
    NEXT_PUBLIC_SITE_PATH:
      process.env.NEXT_PUBLIC_SITE_PATH || "http://localhost:3000/",
    NEXT_PUBLIC_API_Discover_PATH:
      process.env.NEXT_PUBLIC_API_Discover_PATH || "http://localhost:8002/",
    NEXT_PUBLIC_API_PATH: process.env.NEXT_PUBLIC_API_PATH || "http://localhost:8002/",
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "api.studentcompanionconnect.com",
      },
      {
        protocol: "https",
        hostname: "*.run.app",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
