/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Add external hosts used by components (e.g. Unsplash and pravatar)
    domains: ['images.unsplash.com', 'i.pravatar.cc'],
    // If you need finer control use `remotePatterns` instead, e.g.: 
    // remotePatterns: [
    //   { protocol: 'https', hostname: 'images.unsplash.com' },
    //   { protocol: 'https', hostname: 'i.pravatar.cc' },
    // ],
  },
};

export default nextConfig;
