/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // ✅ disables optimization for static export
  },
};

module.exports = nextConfig;
