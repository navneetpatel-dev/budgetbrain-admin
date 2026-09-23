import type { NextConfig } from 'next';
import withBundleAnalyzerFactory from '@next/bundle-analyzer';

const withBundleAnalyzer = withBundleAnalyzerFactory({ enabled: process.env.ANALYZE === 'true' });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
};

export default withBundleAnalyzer(nextConfig);
