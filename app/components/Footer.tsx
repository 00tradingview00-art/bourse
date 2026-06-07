'use client'

import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Daily Brief', href: '/briefs' },
  { label: 'Screener', href: '/screener' },
  { label: 'Sectors', href: '/sectors' },
  { label: 'Bond Yields', href: '/bonds' },
  { label: 'Guides', href: '/guides' },
  { label: 'Calculators', href: '/calculators' },
  { label: 'Watchlist', href: '/watchlist' },
  { label: 'About', href: '#about' },
]

const LEGAL_LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Cookies', href: '/cookies' },
]

export default function Footer() {
  return (
    <footer id="about" style={{ background: '#080808' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
            Boursee<span style={{ color: '#4ade80' }}>.</span>
          </div>
          <div style={{ fontSize: '12px', color: '#444', marginTop: '4px' }}>
            European market intelligence. In plain English.
          </div>
        </div>
        <ul style={{ display: 'flex', gap: '24px', listStyle: 'none', flexWrap: 'wrap' }}>
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <Link href={link.href} style={{ fontSize: '12px', color: '#444', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#888')}
                onMouseLeave={e => (e.currentTarget.style.color = '#444')}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div style={{ textAlign: 'right', fontSize: '11px', color: '#333', lineHeight: 1.6 }}>
          Covering Euronext · Xetra · LSE · Nasdaq Nordic<br />
          © 2026 Boursee. Not investment advice.
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 32px 32px', borderTop: '1px solid #141414', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ fontSize: '11px', color: '#2a2a2a', lineHeight: 1.6, maxWidth: '560px' }}>
          Content produced for general information purposes only under Article 24 MiFID II. Not personalised investment advice.
          Not regulated by the AFM or FCA. Past performance is not indicative of future results.
          Prices may be delayed up to 15 minutes.
        </p>
        <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', flexWrap: 'wrap' }}>
          {LEGAL_LINKS.map(link => (
            <li key={link.href}>
              <Link href={link.href} style={{ fontSize: '11px', color: '#2a2a2a', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#555')}
                onMouseLeave={e => (e.currentTarget.style.color = '#2a2a2a')}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
