/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output for Vercel
  // output: 'standalone',
  
  // Add experimental features if needed
  experimental: {
    appDir: true,
  },
  
  // Ensure proper image optimization
  images: {
    domains: [],
  },
}

module.exports = nextConfig 