import type { NextConfig } from 'next';
import { wgslTurbopackRule } from '@vgpu/wgsl/next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    rules: { '*.wgsl': wgslTurbopackRule({ minify: true }) },
  },
};

export default nextConfig;
