/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'localhost']
  },
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:8000/api'
  }
}

module.exports = nextConfig
