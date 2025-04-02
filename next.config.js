/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  distDir: 'out',
  cleanDistDir: true,
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  basePath: '',
  assetPrefix: '',
  generateStaticParams: async () => {
    return {
      '/': {},
    }
  },
}

module.exports = nextConfig 