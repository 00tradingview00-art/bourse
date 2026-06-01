'use client'

const FOOTER_LINKS = ['Daily Brief', 'Screener', 'About', 'Privacy']

export default function Footer() {
  return (
    <footer id="about" style={{ background: '#080808', padding: '48px 32px' }}>
      <div className="max-w-[1200px] mx-auto" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
            Bourse<span style={{ color: '#4ade80' }}>.</span>
          </div>
          <div style={{ fontSize: '12px', color: '#444', marginTop: '4px' }}>
            European market intelligence. In plain English.
          </div>
        </div>
        <ul style={{ display: 'flex', gap: '24px', listStyle: 'none' }}>
          {FOOTER_LINKS.map(link => (
            <li key={link}>
              <a href="#" style={{ fontSize: '12px', color: '#444', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#888')}
                onMouseLeave={e => (e.currentTarget.style.color = '#444')}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
        <div style={{ textAlign: 'right', fontSize: '11px', color: '#333', lineHeight: 1.6 }}>
          Covering Euronext · Xetra · LSE · Nasdaq Nordic<br />
          © 2026 Bourse. Not investment advice.
        </div>
      </div>
    </footer>
  )
}
