import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchArticles } from '@/lib/fetchArticles'

export const metadata: Metadata = {
  title: 'Market Explainers — European Investing Guides | Boursee',
  description: 'In-depth explainers on European markets: bond yields, indices, ETF regulation, ECB policy, and more. Plain English guides for European investors.',
}

export default async function ArticlesPage() {
  const articles = await fetchArticles()

  return (
    <main style={{ background: 'var(--paper)', minHeight: '70vh' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 32px 96px' }}>

        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 3vw, 34px)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
            Market Explainers
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ink-3)', lineHeight: 1.7 }}>
            In-depth guides on European markets, indices, regulation, and macro mechanics — written for investors who want to understand the why, not just the what.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {articles.map((article, i) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  padding: '24px 0',
                  borderTop: i === 0 ? '1px solid var(--border)' : undefined,
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--accent-light)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
              >
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {article.tags.map(tag => (
                    <span key={tag} style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '2px', background: 'var(--accent-light)', color: 'var(--accent)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.3, marginBottom: '6px' }}>
                  {article.title}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.6, marginBottom: '8px' }}>
                  {article.description}
                </p>
                <div style={{ fontSize: '11px', color: 'var(--ink-4)' }}>
                  {new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  )
}
