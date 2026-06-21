'use client'

import Link from 'next/link'
import { useState } from 'react'

const DROPDOWN_STYLE: React.CSSProperties = {
  position: 'absolute', top: '100%', left: 0, zIndex: 100,
  background: '#fff', border: '1px solid var(--border)',
  borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  minWidth: '180px', padding: '6px 0', marginTop: '4px',
}

const ITEM_STYLE: React.CSSProperties = {
  display: 'block', padding: '9px 16px', fontSize: '14px',
  color: 'var(--ink-2)', textDecoration: 'none', transition: 'background 0.1s',
}

function DropdownItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={ITEM_STYLE}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--paper)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {label}
    </Link>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [marketsOpen, setMarketsOpen] = useState(false)
  const [researchOpen, setResearchOpen] = useState(false)

  const navLinkStyle: React.CSSProperties = {
    fontSize: '13px', fontWeight: 400, color: 'var(--ink-3)', textDecoration: 'none',
    letterSpacing: '0.01em', transition: 'color 0.15s', cursor: 'pointer',
    background: 'none', border: 'none', fontFamily: 'var(--sans)', padding: 0,
  }

  return (
    <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--paper)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="mob-nav-px" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link href="/" style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', textDecoration: 'none' }}>
          Boursee<span style={{ color: 'var(--accent)' }}>.</span>
        </Link>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>

          {/* Markets dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setMarketsOpen(true)}
            onMouseLeave={() => setMarketsOpen(false)}
          >
            <button style={navLinkStyle}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--ink)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--ink-3)')}
            >
              Markets ▾
            </button>
            {marketsOpen && (
              <>
                {/* Invisible bridge prevents hover gap between button and dropdown */}
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: '8px' }} />
                <div style={DROPDOWN_STYLE}>
                  <DropdownItem href="/#markets"    label="Market Overview" />
                  <DropdownItem href="/screener"    label="Stock Screener" />
                  <DropdownItem href="/sectors"     label="Sector Heatmap" />
                  <DropdownItem href="/bonds"       label="Bond Yields" />
                  <DropdownItem href="/macro-bridge" label="Macro–Equity Bridge" />
                  <DropdownItem href="/brokers"     label="Broker Comparison" />
                </div>
              </>
            )}
          </div>

          {/* Research dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setResearchOpen(true)}
            onMouseLeave={() => setResearchOpen(false)}
          >
            <button style={navLinkStyle}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--ink)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--ink-3)')}
            >
              Research ▾
            </button>
            {researchOpen && (
              <>
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: '8px' }} />
                <div style={DROPDOWN_STYLE}>
                  <DropdownItem href="/"            label="Today's Brief" />
                  <DropdownItem href="/briefs"      label="Brief Archive" />
                  <DropdownItem href="/guides"      label="Investor Guides" />
                  <DropdownItem href="/calculators" label="Tax Calculators" />
                  <DropdownItem href="/about"       label="About" />
                </div>
              </>
            )}
          </div>

          {/* Direct links */}
          {[{ label: 'Screener', href: '/screener' }, { label: 'ECB Watch', href: '/ecb-watch' }, { label: '☆ Watchlist', href: '/watchlist' }].map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={navLinkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-3)')}
            >
              {link.label}
            </Link>
          ))}

          {/* Intelligence search */}
          <Link
            href="/search"
            style={{ ...navLinkStyle, display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid var(--border)', borderRadius: '4px', padding: '5px 10px', fontSize: '12px', color: 'var(--ink-3)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--ink-3)' }}
            title="Ask Boursee — market intelligence"
          >
            <span style={{ fontSize: '11px' }}>✦</span>
            Ask
          </Link>

          {/* CTA */}
          <a
            href="#subscribe"
            style={{
              background: 'var(--ink)', color: '#fff', padding: '7px 18px',
              borderRadius: '3px', fontWeight: 500, fontSize: '12px',
              letterSpacing: '0.04em', textTransform: 'uppercase',
              textDecoration: 'none', transition: 'background 0.15s', display: 'inline-block',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--ink)')}
          >
            Subscribe Free
          </a>
        </div>

        {/* Mobile hamburger — outside desktop-nav so it is visible when desktop-nav is hidden */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--ink)', fontSize: '20px', lineHeight: 1 }}
          aria-label="Toggle menu"
          className="mobile-hamburger"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ borderTop: '1px solid var(--border)', background: '#fff', padding: '16px 20px 24px' }}>
          {[
            { label: 'Market Overview', href: '/#markets' },
            { label: 'Stock Screener', href: '/screener' },
            { label: 'Sector Heatmap', href: '/sectors' },
            { label: 'Bond Yields', href: '/bonds' },
            { label: 'Macro–Equity Bridge', href: '/macro-bridge' },
            { label: 'Broker Comparison', href: '/brokers' },
            { label: 'ECB Watch', href: '/ecb-watch' },
            { label: 'Search', href: '/search' },
            { label: "Today's Brief", href: '/' },
            { label: 'Brief Archive', href: '/briefs' },
            { label: 'Investor Guides', href: '/guides' },
            { label: 'Tax Calculators', href: '/calculators' },
            { label: 'About', href: '/about' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{ display: 'block', padding: '10px 0', fontSize: '15px', color: 'var(--ink-2)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="#subscribe"
            onClick={() => setMobileOpen(false)}
            style={{ display: 'block', marginTop: '16px', background: 'var(--accent)', color: '#fff', padding: '11px 20px', borderRadius: '3px', fontWeight: 500, fontSize: '13px', textAlign: 'center', textDecoration: 'none' }}
          >
            Subscribe Free
          </a>
        </div>
      )}
    </nav>
  )
}
