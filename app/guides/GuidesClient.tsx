'use client'

import Link from 'next/link'

interface Guide {
  href: string
  flag: string
  country: string
  title: string
  subtitle: string
  tags: string[]
  readTime: string
}

export default function GuidesClient({ guides }: { guides: Guide[] }) {
  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      {guides.map(g => (
        <Link key={g.href} href={g.href} style={{ textDecoration: 'none' }}>
          <div
            style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '28px 32px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'start', transition: 'border-color 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '22px' }}>{g.flag}</span>
                <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--ink-4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{g.country}</span>
              </div>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px', letterSpacing: '-0.01em' }}>{g.title}</h2>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6, marginBottom: '14px' }}>{g.subtitle}</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {g.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '2px', background: 'var(--paper-2)', color: 'var(--ink-4)' }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', paddingTop: '4px' }}>
              <span style={{ fontSize: '12px', color: 'var(--ink-4)' }}>{g.readTime} read</span>
              <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 500 }}>Read guide →</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
