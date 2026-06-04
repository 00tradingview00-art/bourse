'use client'

const STATS = [
  { num: '6', label: 'Exchanges covered' },
  { num: '6:30', label: 'AM CET delivery' },
  { num: 'Free', label: 'To start' },
  { num: 'MiFID II', label: 'Compliant' },
]

export default function HeroLeft() {
  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-mid)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ width: '28px', height: '1px', background: 'var(--accent-mid)', display: 'inline-block' }} />
        European Market Intelligence
      </div>

      <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(38px, 4.5vw, 58px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '24px' }}>
        Europe&apos;s markets.<br />
        <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Explained daily.</em><br />
        In plain English.
      </h1>

      <p style={{ fontSize: '17px', fontWeight: 300, color: 'var(--ink-2)', lineHeight: 1.65, maxWidth: '520px', marginBottom: '36px' }}>
        Boursee delivers independent intelligence on Euronext, DAX, FTSE and the ECB — every morning at 6:30 AM CET. Research-grade analysis built for the 400 million Europeans who invest, and the millions more who should.
      </p>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '48px', flexWrap: 'wrap' }}>
        <a
          href="#subscribe"
          style={{ background: 'var(--accent)', color: '#fff', padding: '12px 28px', borderRadius: '3px', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--ink)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'var(--accent)')}
        >
          Get the Daily Brief →
        </a>
        <a href="#briefs" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '14px', color: 'var(--ink-3)', textDecoration: 'none', padding: '12px 0' }}>
          View archive
        </a>
      </div>

      <div style={{ display: 'flex', gap: '36px', paddingTop: '36px', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
        {STATS.map(stat => (
          <div key={stat.label}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1, marginBottom: '4px' }}>
              {stat.num}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ink-4)', letterSpacing: '0.04em' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
