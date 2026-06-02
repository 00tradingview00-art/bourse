import Link from 'next/link'
import { fetchBriefs } from '@/lib/fetchBriefs'

const TAG_COLORS: Record<string, string> = {
  green: 'var(--accent)',
  gold: 'var(--gold)',
  red: 'var(--red)',
  default: 'var(--ink-4)',
}

export const metadata = {
  title: 'Daily Brief Archive — Bourse',
  description: 'All editions of the Bourse European market intelligence daily brief.',
}

export default async function BriefsPage() {
  const briefs = await fetchBriefs()

  return (
    <main style={{ background: 'var(--paper)', minHeight: '70vh' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '64px 32px 96px' }}>

        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>
            The Daily Brief
          </p>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '36px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '12px' }}>
            Brief Archive
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ink-3)', lineHeight: 1.7 }}>
            Every weekday at 6:30 AM CET — European market intelligence in plain English.
            {' '}{briefs.length} editions published.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {briefs.map((brief, i) => (
            <Link
              key={brief.slug}
              href={`/briefs/${brief.slug}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '72px 1fr auto',
                gap: '28px',
                alignItems: 'start',
                padding: '28px 0',
                borderBottom: i < briefs.length - 1 ? '1px solid var(--border)' : 'none',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{
                fontFamily: 'var(--serif)',
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--paper-3)',
                fontVariantNumeric: 'tabular-nums',
                paddingTop: '3px',
              }}>
                #{String(brief.edition).padStart(3, '0')}
              </div>

              <div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {brief.tags.map(tag => (
                    <span key={tag.label} style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: TAG_COLORS[tag.variant] ?? 'var(--ink-4)',
                    }}>
                      {tag.label}
                    </span>
                  )).reduce((acc: React.ReactNode[], el, i, arr) => {
                    acc.push(el)
                    if (i < arr.length - 1) acc.push(<span key={`sep-${i}`} style={{ fontSize: '10px', color: 'var(--border)' }}>·</span>)
                    return acc
                  }, [])}
                </div>
                <h2 style={{
                  fontFamily: 'var(--serif)',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  lineHeight: 1.35,
                  marginBottom: '8px',
                  letterSpacing: '-0.01em',
                }}>
                  {brief.headline}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.65 }}>
                  {brief.excerpt.length > 140 ? brief.excerpt.slice(0, 140) + '…' : brief.excerpt}
                </p>
              </div>

              <div style={{ textAlign: 'right', paddingTop: '3px', flexShrink: 0 }}>
                <div style={{ fontSize: '12px', color: 'var(--ink-4)', whiteSpace: 'nowrap' }}>{brief.dateShort}</div>
                <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '4px' }}>⏱ {brief.readTime} min</div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  )
}
