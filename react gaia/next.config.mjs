/** @type {import('next').NextConfig} */
const FLASK_URL = process.env.FLASK_URL || "http://192.168.88.9:5500"

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
