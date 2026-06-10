import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    root: process.cwd(),
  },
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === '1',
  },
};

export default nextConfig;
