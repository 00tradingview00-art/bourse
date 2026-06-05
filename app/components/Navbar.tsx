'use client'

import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Daily Brief', href: '#briefs' },
  { label: 'Markets', href: '#markets' },
  { label: 'Screener', href: '/screener' },
  { label: 'Coverage', href: '#coverage' },
  { label: 'About', href: '#about' },
]

export default function Navbar() {
  return (
    <nav
      style={{ borderBottom: '1px solid var(--border)', background: 'var(--paper)' }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-[1200px] mx-auto px-8 h-[60px] flex items-center justify-between">
        <Link
          href="/"
          style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}
          className="no-underline"
        >
          Boursee<span style={{ color: 'var(--accent)' }}>.</span>
        </Link>

        <ul className="hidden md:flex items-center gap-7 list-none">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                style={{ fontSize: '13px', fontWeight: 400, color: 'var(--ink-3)', textDecoration: 'none', letterSpacing: '0.01em', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-3)')}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#subscribe"
              style={{
                background: 'var(--ink)', color: '#fff', padding: '7px 18px',
                borderRadius: '3px', fontWeight: 500, fontSize: '12px',
                letterSpacing: '0.04em', textTransform: 'uppercase',
                textDecoration: 'none', transition: 'background 0.15s',
                display: 'inline-block'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--ink)')}
            >
              Subscribe Free
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
