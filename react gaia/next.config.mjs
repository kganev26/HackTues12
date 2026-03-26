/** @type {import('next').NextConfig} */
const FLASK_URL = process.env.FLASK_URL || "http://localhost:5500"

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${FLASK_URL}/:path*`,
      },
    ]
  },
}

export default nextConfig
