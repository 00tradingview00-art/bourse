import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bourse — European Market Intelligence',
  description: 'Independent daily research on Euronext, DAX, FTSE and the ECB. Delivered at 6:30 AM CET. For the 400 million Europeans who invest.',
  openGraph: {
    title: 'Bourse — European Market Intelligence',
    description: 'Independent daily research on Euronext, DAX, FTSE and the ECB.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
