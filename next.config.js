/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Allow external connections
  experimental: {
    serverComponentsExternalPackages: ['socket.io']
  }
}

module.exports = nextConfig 