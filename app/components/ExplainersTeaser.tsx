import Link from 'next/link'
import { fetchArticles } from '@/lib/fetchArticles'

export default async function ExplainersTeaser() {
  const articles = await fetchArticles()
  const featured = articles.slice(0, 3)
  if (featured.length === 0) return null

  return (
    <section style={{ background: 'var(--paper-2)', borderBottom: '1px solid var(--border)' }}>
      <div className="mob-px" style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 32px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--accent-mid)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px', height: '1px', background: 'var(--accent-mid)', display: 'inline-block' }} />
              Market Explainers
            </div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Understand the mechanics
            </h2>
          </div>
          <Link href="/articles" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            All guides →
          </Link>
        </div>

        <div className="mob-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }}>
          {featured.map(article => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              style={{ textDecoration: 'none', display: 'block', background: 'var(--paper)', padding: '24px' }}
            >
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {article.tags.slice(0, 2).map(tag => (
                  <span key={tag} style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '2px', background: 'var(--accent-light)', color: 'var(--accent)' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.35, marginBottom: '8px' }}>
                {article.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.6 }}>
                {article.description}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
