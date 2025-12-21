/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow Next Image Optimization to fetch images from the local API server
    // running on http://localhost:5000 (e.g. /uploads/blogs/...)
    // and from the production domain thinkora.me
    // Adjust the remotePatterns as needed for your use case
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**'
      }
      ,
      // Allow fetching images from your production domain
      {
        protocol: 'https',
        hostname: 'thinkora.me',
        port: '',
        pathname: '/uploads/**'
      },
      {
        protocol: 'https',
        hostname: 'www.thinkora.me',
        port: '',
        pathname: '/uploads/**'
      }
    ]
  },

  // Rewrite requests to /uploads/* to the local API server
  // This allows serving images directly from the API server during development
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:5000/uploads/:path*'
      }
    ];
  }
};

export default nextConfig;
