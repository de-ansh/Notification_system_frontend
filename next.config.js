/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output for Vercel
  // output: 'standalone',
  
  // Ensure proper image optimization
  images: {
    domains: [],
  },
}

module.exports = nextConfig 