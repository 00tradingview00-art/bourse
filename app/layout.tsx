import type { Metadata } from 'next'
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
