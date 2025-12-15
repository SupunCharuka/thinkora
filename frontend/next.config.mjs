/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Add external hosts used by components (e.g. Unsplash and pravatar)
    domains: ['images.unsplash.com', 'i.pravatar.cc', 'localhost', '127.0.0.1'],
    // If you need finer control use `remotePatterns` instead, e.g. allow localhost:5000
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i.pravatar.cc', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '5000', pathname: '/uploads/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '5000', pathname: '/uploads/**' },
    ],
  },
  // Proxy local uploads to backend during development to avoid
  // Next's private-IP blocking when optimizing images from localhost.
  // async rewrites() {
  //   return [
  //     {
  //       source: '/uploads/:path*',
  //       destination: 'http://localhost:5000/uploads/:path*',
  //     },
  //   ];
  // },
};

export default nextConfig;
