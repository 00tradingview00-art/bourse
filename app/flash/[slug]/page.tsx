import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getFlashSlugs } from '@/lib/fetchFlash'
import type { FlashMetadata } from '@/lib/fetchFlash'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = getFlashSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const mod = await import(`@/content/flash/${slug}.mdx`)
    const metadata = mod.metadata as FlashMetadata
    return {
      title: `${metadata.headline} | Boursee Flash`,
      description: metadata.excerpt,
    }
  } catch {
    return { title: 'Flash Intelligence | Boursee' }
  }
}

const TAG_STYLES: Record<string, React.CSSProperties> = {
  green: { background: 'var(--accent-light)', color: 'var(--accent)', border: 'none' },
  gold: { background: 'var(--gold-light)', color: 'var(--gold)', border: 'none' },
  red: { background: 'var(--red-light)', color: 'var(--red)', border: 'none' },
  default: { background: 'transparent', color: 'var(--ink-3)', border: '1px solid var(--border)' },
}

const CATEGORY_LABELS: Record<string, string> = {
  ecb: 'ECB Decision',
  macro: 'Macro Data',
  earnings: 'Earnings',
  markets: 'Markets',
  bonds: 'Bond Markets',
}

export default async function FlashArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let FlashContent: React.ComponentType
  let metadata: FlashMetadata

  try {
    const mod = await import(`@/content/flash/${slug}.mdx`)
    FlashContent = mod.default as React.ComponentType
    metadata = mod.metadata as FlashMetadata
  } catch {
    return notFound()
  }

  const pubTime = metadata.generatedAt
    ? new Date(metadata.generatedAt).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam' })
    : null

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '70vh' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 32px 96px' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--ink-4)', marginBottom: '32px' }}>
            <Link href="/" style={{ color: 'var(--ink-4)', textDecoration: 'none' }}>Boursee</Link>
            <span>›</span>
            <Link href="/flash" style={{ color: 'var(--ink-4)', textDecoration: 'none' }}>Flash Intelligence</Link>
            <span>›</span>
            <span style={{ color: 'var(--ink-3)' }}>{CATEGORY_LABELS[metadata.category] ?? 'Flash'}</span>
          </div>

          {/* MAR disclosure */}
          <div style={{
            background: 'var(--gold-light)', border: '1px solid var(--border)',
            borderLeft: '3px solid var(--gold)', borderRadius: '3px',
            padding: '10px 16px', marginBottom: '32px',
            display: 'flex', flexWrap: 'wrap', gap: '4px 16px', alignItems: 'center',
          }}>
            <span style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.02em' }}>
              ⚡ Flash Intelligence · AI-generated · General information only · Not personalised investment advice
            </span>
            <span style={{ fontSize: '11px', color: 'var(--ink-4)' }}>
              {metadata.dateShort}{pubTime ? ` at ${pubTime} CET` : ''}
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
              fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 700,
              color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '16px',
            }}>
              {metadata.headline}
            </h1>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--ink-4)' }}>
              <span>{metadata.date}</span>
              {pubTime && <span>{pubTime} CET</span>}
              <span>⏱ {metadata.readTime} min read</span>
            </div>
          </div>

          {/* Article content */}
          <article>
            <FlashContent />
          </article>

          {/* Back to flash */}
          <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/flash" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
              ← All flash articles
            </Link>
            <Link href="/" style={{ fontSize: '13px', color: 'var(--ink-4)', textDecoration: 'none' }}>
              Today&apos;s Brief →
            </Link>
          </div>

          <div style={{ marginTop: '24px', padding: '16px 20px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', borderRadius: '3px', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.65 }}>
            This flash article was generated by AI from public news sources. For general information purposes only.
            Not personalised investment advice under MiFID II Article 24. Verify data with primary sources before acting.{' '}
            <Link href="/disclaimer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Full disclaimer →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
