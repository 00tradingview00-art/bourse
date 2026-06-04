import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBriefSlugs, fetchBriefs } from '@/lib/fetchBriefs'
import ReadingProgress from './ReadingProgress'
import type { BriefMetadata } from '@/types'

export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = getBriefSlugs()
  return slugs.map(slug => ({ slug }))
}

const TAG_STYLES: Record<string, React.CSSProperties> = {
  green: { background: 'var(--accent-light)', color: 'var(--accent)', border: 'none' },
  gold: { background: 'var(--gold-light)', color: 'var(--gold)', border: 'none' },
  red: { background: 'var(--red-light)', color: 'var(--red)', border: 'none' },
  default: { background: 'transparent', color: 'var(--ink-3)', border: '1px solid var(--border)' },
}

export default async function BriefPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let BriefContent: React.ComponentType
  let metadata: BriefMetadata

  try {
    const mod = await import(`@/content/briefs/${slug}.mdx`)
    BriefContent = mod.default as React.ComponentType
    metadata = mod.metadata as BriefMetadata
  } catch {
    return notFound()
  }

  // Prev / next (sorted descending by edition — [0] is newest)
  const allBriefs = await fetchBriefs()
  const idx = allBriefs.findIndex(b => b.slug === slug)
  const newer = idx > 0 ? allBriefs[idx - 1] : null      // lower index = newer
  const older = idx < allBriefs.length - 1 ? allBriefs[idx + 1] : null

  return (
    <>
      <ReadingProgress />
      <main style={{ background: 'var(--paper)', minHeight: '70vh' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 32px 96px' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--ink-4)', marginBottom: '32px' }}>
            <Link href="/" style={{ color: 'var(--ink-4)', textDecoration: 'none' }}>Boursee</Link>
            <span>›</span>
            <Link href="/briefs" style={{ color: 'var(--ink-4)', textDecoration: 'none' }}>Daily Brief</Link>
            <span>›</span>
            <span style={{ color: 'var(--ink-3)' }}>Edition #{String(metadata.edition).padStart(3, '0')}</span>
          </div>

          {/* MAR disclosure box */}
          <div style={{
            background: 'var(--gold-light)',
            border: '1px solid var(--border)',
            borderLeft: '3px solid var(--gold)',
            borderRadius: '3px',
            padding: '10px 16px',
            marginBottom: '32px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px 16px',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.02em' }}>
              Market Analysis · General information only · Not personalised investment advice
            </span>
            <span style={{ fontSize: '11px', color: 'var(--ink-4)' }}>
              Data may be delayed · Published {metadata.dateShort} by Boursee Editorial
            </span>
            <Link href="/disclaimer" style={{ fontSize: '11px', color: 'var(--accent)', textDecoration: 'none' }}>
              See full disclaimer →
            </Link>
          </div>

          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {metadata.tags.map(tag => (
                <span
                  key={tag.label}
                  style={{
                    fontSize: '10px', fontWeight: 500, letterSpacing: '0.06em',
                    textTransform: 'uppercase', padding: '3px 10px', borderRadius: '2px',
                    ...TAG_STYLES[tag.variant],
                  }}
                >
                  {tag.label}
                </span>
              ))}
            </div>
            <h1 style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(24px, 3vw, 32px)',
              fontWeight: 700,
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '16px',
            }}>
              {metadata.headline}
            </h1>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--ink-4)' }}>
              <span>{metadata.date}</span>
              <span>⏱ {metadata.readTime} min read</span>
              <span>Edition #{String(metadata.edition).padStart(3, '0')}</span>
            </div>
          </div>

          {/* Article content */}
          <article>
            <BriefContent />
          </article>

          {/* Prev / Next navigation */}
          <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                {older && (
                  <Link href={`/briefs/${older.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '10px', color: 'var(--ink-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>← Previous</div>
                    <div style={{ fontSize: '13px', color: 'var(--ink-2)', fontWeight: 500, lineHeight: 1.4 }}>{older.headline}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '4px' }}>{older.dateShort}</div>
                  </Link>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                {newer && (
                  <Link href={`/briefs/${newer.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '10px', color: 'var(--ink-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Next →</div>
                    <div style={{ fontSize: '13px', color: 'var(--ink-2)', fontWeight: 500, lineHeight: 1.4 }}>{newer.headline}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '4px' }}>{newer.dateShort}</div>
                  </Link>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link href="/briefs" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                ← All editions
              </Link>
              <div style={{ fontSize: '11px', color: 'var(--ink-4)', textAlign: 'right', lineHeight: 1.6 }}>
                Content is for informational purposes only.<br />
                Not personalised investment advice.
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}
