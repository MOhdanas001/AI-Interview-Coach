/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@ai-interview-coach/types',
    '@ai-interview-coach/shared',
    '@ai-interview-coach/ai',
  ],
};

module.exports = nextConfig;
