'use client'

import type { BriefMetadata } from '@/types'

interface Props {
  briefs: BriefMetadata[]
}

export default function BriefsArchive({ briefs }: Props) {
  return (
    <section id="briefs" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '80px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '36px' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Recent briefs
          </h2>
          <a
            href="/briefs"
            style={{ fontSize: '12px', color: 'var(--accent-mid)', textDecoration: 'none', letterSpacing: '0.04em', fontWeight: 500, borderBottom: '1px solid currentColor', paddingBottom: '1px' }}
          >
            View all editions →
          </a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {briefs.slice(0, 5).map((brief, i) => (
            <a
              key={brief.edition}
              href={`/briefs/${brief.slug}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto',
                gap: '24px',
                alignItems: 'center',
                padding: '20px 0',
                borderBottom: i < Math.min(briefs.length, 5) - 1 ? '1px solid var(--border)' : 'none',
                textDecoration: 'none',
                color: 'inherit',
              }}
              className="group"
            >
              <div style={{ fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 700, color: 'var(--paper-3)', fontVariantNumeric: 'tabular-nums' }}>
                #{String(brief.edition).padStart(3, '0')}
              </div>
              <div>
                <div
                  style={{ fontFamily: 'var(--serif)', fontSize: '17px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginBottom: '4px', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink)')}
                >
                  {brief.headline}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-4)' }}>
                  {brief.tags.map(t => t.label).join(' · ')}
                </div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ink-4)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
                {brief.dateShort}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
