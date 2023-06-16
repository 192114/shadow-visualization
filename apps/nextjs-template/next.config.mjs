/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  // async rewrites() {
  //   return {
  //     fallback: [
  //       {
  //         source: '/api/:path*',
  //         destination: `${process.env.PROXY_URL}/:path*`,
  //       },
  //     ],
  //   }
  // },
  images: {
    remotePatterns: [],
  },
}

export default nextConfig
