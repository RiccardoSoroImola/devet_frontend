/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/devet_frontend',
  assetPrefix: '/devet_frontend/',
  images: {
    unoptimized: true, // ✅ disables optimization for static export
  },
};

module.exports = nextConfig;
