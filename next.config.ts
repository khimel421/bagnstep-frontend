/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "walkerlifestyle.com",
      },
    ],
  },
};

module.exports = nextConfig;
