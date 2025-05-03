import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dzmbj5d0b/image/upload/**",
      },
    ],
  },
};

export default nextConfig;
