/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore ESLint errors in production builds
  },
  async redirects() {
    return [
      {
        source: "/signup",
        destination: "/",
        permanent: false,
      },
      
    ];
  },
};

module.exports = nextConfig;
