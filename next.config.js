/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  distDir: 'out',
  cleanDistDir: true,
  trailingSlash: true
}

module.exports = nextConfig 