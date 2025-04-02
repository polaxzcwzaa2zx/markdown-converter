import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // 静态导出
  images: {
    unoptimized: true,
  },
  basePath: '',
  assetPrefix: '',
};

export default nextConfig;
