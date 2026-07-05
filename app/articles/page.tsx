import type { Metadata } from 'next'
import { fetchArticles } from '@/lib/fetchArticles'
import ArticleCard from './ArticleCard'

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
            <ArticleCard key={article.slug} article={article} index={i} />
          ))}
        </div>

      </div>
    </main>
  )
}
