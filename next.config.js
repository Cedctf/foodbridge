/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow external connections
  serverExternalPackages: ['socket.io']
}

module.exports = nextConfig