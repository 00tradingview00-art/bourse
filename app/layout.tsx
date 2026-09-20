import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import Analytics from '@/app/components/Analytics'
import CookieConsent from '@/app/components/CookieConsent'
import { SITE_URL, organizationJsonLd, safeJsonLd } from '@/lib/seo'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Boursee — European Market Intelligence',
  description: 'Independent daily research on Euronext, DAX, FTSE and the ECB. Delivered at 6:30 AM CET. For the 400 million Europeans who invest.',
  // Self-referencing canonical: './' resolves to the current page's own URL against metadataBase.
  alternates: { canonical: './', types: { 'application/rss+xml': '/feed.xml' } },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
  },
  // OG/Twitter images come from app/opengraph-image.tsx and app/twitter-image.tsx (PNG, not SVG).
  openGraph: {
    title: 'Boursee — European Market Intelligence',
    description: 'Independent daily research on Euronext, DAX, FTSE and the ECB. For the 400 million Europeans who invest.',
    type: 'website',
    siteName: 'Boursee',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boursee — European Market Intelligence',
    description: 'Independent daily research on Euronext, DAX, FTSE and the ECB.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }}
        />
        {children}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  )
}
