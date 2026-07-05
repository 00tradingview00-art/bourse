import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticleSlugs } from '@/lib/fetchArticles'
import type { ArticleMetadata } from '@/types'

export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = getArticleSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const mod = await import(`@/content/articles/${slug}.mdx`)
    const metadata = mod.metadata as ArticleMetadata
    return {
      title: `${metadata.title} | Boursee`,
      description: metadata.description,
      keywords: metadata.keywords,
    }
  } catch {
    return { title: 'Article | Boursee' }
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let ArticleContent: React.ComponentType
  let metadata: ArticleMetadata

  try {
    const mod = await import(`@/content/articles/${slug}.mdx`)
    ArticleContent = mod.default as React.ComponentType
    metadata = mod.metadata as ArticleMetadata
  } catch {
    return notFound()
  }

  const formattedDate = new Date(metadata.date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <main style={{ background: 'var(--paper)', minHeight: '70vh' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 32px 96px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--ink-4)', marginBottom: '32px' }}>
          <Link href="/" style={{ color: 'var(--ink-4)', textDecoration: 'none' }}>Boursee</Link>
          <span>›</span>
          <Link href="/guides" style={{ color: 'var(--ink-4)', textDecoration: 'none' }}>Guides</Link>
          <span>›</span>
          <span style={{ color: 'var(--ink-3)' }}>{metadata.topic}</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {metadata.tags.map(tag => (
              <span
                key={tag}
                style={{
                  fontSize: '10px', fontWeight: 500, letterSpacing: '0.06em',
                  textTransform: 'uppercase', padding: '3px 10px', borderRadius: '2px',
                  background: 'var(--accent-light)', color: 'var(--accent)',
                }}
              >
                {tag}
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
            {metadata.title}
          </h1>
          <div style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.6, marginBottom: '12px' }}>
            {metadata.description}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ink-4)' }}>
            {formattedDate} · Boursee Editorial
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          background: 'var(--gold-light)',
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--gold)',
          borderRadius: '3px',
          padding: '10px 16px',
          marginBottom: '40px',
          fontSize: '11px',
          color: 'var(--ink-3)',
        }}>
          General information only · Not personalised investment advice ·{' '}
          <Link href="/disclaimer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>See full disclaimer →</Link>
        </div>

        {/* Article content */}
        <article style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink-2)' }}>
          <ArticleContent />
        </article>

        {/* Footer nav */}
        <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/guides" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
            ← All guides
          </Link>
          <div style={{ fontSize: '11px', color: 'var(--ink-4)', textAlign: 'right', lineHeight: 1.6 }}>
            Content is for informational purposes only.<br />
            Not personalised investment advice.
          </div>
        </div>

      </div>
    </main>
  )
}
