'use client'

import Link from 'next/link'
import type { ArticleMetadata } from '@/types'

export default function ArticleCard({ article, index }: { article: ArticleMetadata; index: number }) {
  return (
    <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          padding: '24px 0',
          borderTop: index === 0 ? '1px solid var(--border)' : undefined,
          borderBottom: '1px solid var(--border)',
          transition: 'background 0.1s',
          cursor: 'pointer',
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
  )
}
