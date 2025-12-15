/** @type {import('next').NextConfig} */
// Build image host configuration including the API host if configured.
const defaultDomains = ['images.unsplash.com', 'i.pravatar.cc', 'picsum.photos', 'localhost', '127.0.0.1'];
const defaultRemote = [
  { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
  { protocol: 'https', hostname: 'i.pravatar.cc', pathname: '/**' },
  { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const domains = [...defaultDomains];
const remotePatterns = [...defaultRemote];

if (apiUrl) {
  try {
    const u = new URL(apiUrl);
    // add hostname to allowed domains
    if (!domains.includes(u.hostname)) domains.push(u.hostname);
    // allow fetching uploads from the API host
    remotePatterns.push({ protocol: u.protocol.replace(':', ''), hostname: u.hostname, port: u.port || undefined, pathname: '/uploads/**' });
  } catch (e) {
    // ignore invalid NEXT_PUBLIC_API_URL
    console.warn('Invalid NEXT_PUBLIC_API_URL in next.config.mjs', e && e.message);
  }
}

const nextConfig = {
  images: {
    domains,
    remotePatterns,
  },
  
  // Rewrite /uploads/* to the API uploads endpoint if configured
  // This allows Next.js Image component to work with uploaded images from the backend
  // e.g. /uploads/image.jpg -> https://api.example.com/uploads/image.jpg
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: apiUrl ? `${apiUrl.replace(/\/$/, '')}/uploads/:path*` : '/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
