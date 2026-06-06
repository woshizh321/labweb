/** @type {import('next').NextConfig} */
const nextConfig = {
  // standalone output keeps the production Docker image small (only traced deps)
  output: 'standalone',
  reactStrictMode: true,
};

module.exports = nextConfig;
