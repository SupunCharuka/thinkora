/** @type {import('next').NextConfig} */
// Build image host configuration including the API host if configured.
const defaultDomains = ['images.unsplash.com', 'i.pravatar.cc', 'picsum.photos', 'localhost', '127.0.0.1'];
const defaultRemote = [
  { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
  { protocol: 'https', hostname: 'i.pravatar.cc', pathname: '/**' },
  { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
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

};

export default nextConfig;
