import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  turbopack: {
    // Define explicit root to prevent resolution issues in directories with spaces
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
