'use client'

import { useState, useEffect } from 'react'
import type { Brief } from '@/types'

function useMarketsOpen() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const cet = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' }))
    const day = cet.getDay()
    if (day === 0 || day === 6) return
    const mins = cet.getHours() * 60 + cet.getMinutes()
    setOpen(mins >= 9 * 60 && mins < 17 * 60 + 30)
  }, [])
  return open
}

const TAG_STYLES: Record<string, React.CSSProperties> = {
  green: { background: 'var(--accent-light)', color: 'var(--accent)', border: 'none' },
  gold: { background: 'var(--gold-light)', color: 'var(--gold)', border: 'none' },
  red: { background: 'var(--red-light)', color: 'var(--red)', border: 'none' },
  default: { background: 'transparent', color: 'var(--ink-3)', border: '1px solid var(--border)' },
}

interface Props {
  brief: Brief
}

export default function TodaysBrief({ brief }: Props) {
  const marketsOpen = useMarketsOpen()

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: marketsOpen ? '#4ade80' : '#888', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
          <div className={marketsOpen ? 'live-dot' : undefined} style={{ width: '6px', height: '6px', borderRadius: '50%', background: marketsOpen ? '#4ade80' : '#555' }} />
          {marketsOpen ? 'Markets Open' : 'Markets Closed'}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '24px 24px 20px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {brief.tags.map((tag) => (
            <span
              key={tag.label}
              style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: '2px', ...TAG_STYLES[tag.variant] }}
            >
              {tag.label}
            </span>
          ))}
        </div>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(18px, 2vw, 22px)', fontWeight: 700, lineHeight: 1.28, color: 'var(--ink)', marginBottom: '12px', letterSpacing: '-0.01em' }}>
          {brief.headline}
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--ink-2)', lineHeight: 1.7, marginBottom: '20px' }}>
          {brief.excerpt}
        </p>
        <a
          href={`/briefs/${brief.slug}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--accent)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '3px', fontSize: '13px', fontWeight: 500, letterSpacing: '0.03em', textDecoration: 'none', transition: 'background 0.15s' }}
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
