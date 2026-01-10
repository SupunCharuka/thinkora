import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import Header from '@/components/header';
import Footer from '@/components/footer';
import CookieConsent from '@/components/cookieConsent';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: 'Thinkora — Thoughts on Tech, Travel & Lifestyle',
    template: '%s | thinkora'
  },
  description: 'Thinkora publishes articles, tutorials and stories about technology, travel, and everyday life. Read practical guides and thoughtful commentary to sharpen your skills and perspective.',
  keywords: [
    'thinkora', 'blog', 'technology', 'design', 'lifestyle', 'tutorials', 'articles', 'travel', 'music', 'news'
  ],
  authors: [{ name: 'thinkora' }],
  openGraph: {
    title: 'Thinkora — Thoughts on Tech, Travel & Lifestyle',
    description: 'Thinkora publishes articles, tutorials and stories about technology, travel, and everyday life.',
    url: 'https://thinkora.me',
    siteName: 'thinkora',
    images: [
      {
        url: 'https://thinkora.me/og-image.png',
        width: 1200,
        height: 630,
        alt: 'thinkora'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'thinkora — Thoughts on tech, travel & life',
    description: 'thinkora publishes articles, tutorials and stories about technology, travel, and everyday life.',
    creator: '@thinkora'
  },
  icons: {
    // using SVG icons with orange theme placed in public/
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg'
  }
};

export default function RootLayout({ children }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="en">
      <head>
        <meta name="monetag" content="a0af0df3861fdecfc2ef49ddacba78cd" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Google Analytics */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_ID}', { page_path: window.location.pathname });`}
        </Script>

        <div className="min-h-screen flex flex-col">
          <Header />

          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-6">
              {children}
            </div>
          </main>

          <Footer />
          <CookieConsent />
        </div>
      </body>
    </html>
  );
}
