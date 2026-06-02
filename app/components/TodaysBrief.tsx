'use client'

import type { Brief, MarketData } from '@/types'

const TAG_STYLES: Record<string, React.CSSProperties> = {
  green: { background: 'var(--accent-light)', color: 'var(--accent)', border: 'none' },
  gold: { background: 'var(--gold-light)', color: 'var(--gold)', border: 'none' },
  red: { background: 'var(--red-light)', color: 'var(--red)', border: 'none' },
  default: { background: 'transparent', color: 'var(--ink-3)', border: '1px solid var(--border)' },
}

interface Props {
  brief: Brief
  markets: MarketData[]
}

export default function TodaysBrief({ brief, markets }: Props) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,0,0,0.06)' }}>
      {/* Header */}
      <div style={{ background: 'var(--ink)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '10px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
            Edition #{brief.edition}
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '16px', color: '#fff', fontWeight: 700 }}>
            {brief.date}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#4ade80', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
          <div className="live-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
          Markets Open
        </div>
      </div>

      {/* Mini market strip */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {markets.slice(0, 6).map((m) => (
          <div key={m.name} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ fontSize: '10px', color: 'var(--ink-4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{m.name}</div>
            <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
            <div style={{ fontSize: '11px', fontWeight: 500, color: m.direction === 'up' ? '#16a34a' : 'var(--red)' }}>{m.changePct}</div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {brief.tags.map((tag) => (
            <span
              key={tag.label}
              style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: '2px', ...TAG_STYLES[tag.variant] }}
            >
              {tag.label}
            </span>
          ))}
        </div>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, lineHeight: 1.3, color: 'var(--ink)', marginBottom: '10px' }}>
          {brief.headline}
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--ink-2)', lineHeight: 1.65, marginBottom: '16px' }}>
          {brief.excerpt}
        </p>
        <a
          href={`/briefs/${brief.slug}`}
          style={{ display: 'block', width: '100%', background: 'var(--accent)', color: '#fff', border: 'none', padding: '12px', borderRadius: '3px', fontSize: '13px', fontWeight: 500, letterSpacing: '0.04em', textAlign: 'center', textDecoration: 'none', transition: 'background 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--ink)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
        >
          Read full brief →
        </a>
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ink-4)' }}>
        <span>📧 Delivered 6:30 AM CET</span>
        <span>⏱ {brief.readTime} min read</span>
      </div>
    </div>
  )
}
