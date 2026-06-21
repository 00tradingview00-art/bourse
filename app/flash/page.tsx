import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchFlash } from '@/lib/fetchFlash'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Flash Intelligence — Live European Market Alerts | Boursee',
  description: 'Intraday European market intelligence on ECB decisions, eurozone CPI, major earnings (ASML, LVMH, Shell, SAP), and significant index moves. Updated throughout EU market hours.',
}

const TAG_COLORS: Record<string, string> = {
  green: 'var(--accent)',
  gold: 'var(--gold)',
  red: 'var(--red)',
  default: 'var(--ink-4)',
}

const CATEGORY_LABELS: Record<string, string> = {
  ecb: 'ECB',
  macro: 'Macro',
  earnings: 'Earnings',
  markets: 'Markets',
  bonds: 'Bonds',
}

export default function FlashPage() {
  const articles = fetchFlash()

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '70vh' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '64px 32px 96px' }}>

          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
                Live Intelligence
              </span>
              <span style={{
                fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                background: 'var(--accent)', color: '#fff', padding: '2px 8px', borderRadius: '2px',
              }}>
                EU Market Hours
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: '36px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '12px' }}>
              Flash Intelligence
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--ink-3)', lineHeight: 1.7, maxWidth: '560px' }}>
              Intraday alerts on ECB decisions, eurozone CPI and PMI prints, major European earnings,
              and significant index moves. Published within minutes of the event, Mon–Fri 08:00–17:30 CET.
            </p>
          </div>

          {articles.length === 0 ? (
            <div style={{ padding: '48px 0', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>&#9889;</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '18px', color: 'var(--ink-3)', marginBottom: '8px' }}>No flash articles yet</div>
              <div style={{ fontSize: '14px', color: 'var(--ink-4)' }}>Flash articles appear here when significant European market events are detected during EU market hours.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {articles.map((article, i) => {
                const pubTime = article.generatedAt
                  ? new Date(article.generatedAt).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam' })
                  : null

                return (
                  <Link
                    key={article.slug}
                    href={`/flash/${article.slug}`}
                    style={{
                      display: 'block',
                      padding: '28px 0',
                      borderBottom: i < articles.length - 1 ? '1px solid var(--border)' : 'none',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                        color: 'var(--accent)', background: 'var(--accent-light)', padding: '2px 8px', borderRadius: '2px',
                      }}>
                        {CATEGORY_LABELS[article.category] ?? 'Flash'}
                      </span>
                      {article.tags.map((tag, j) => (
                        <span key={j} style={{
                          fontSize: '10px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
                          color: TAG_COLORS[tag.variant] ?? 'var(--ink-4)',
                        }}>
                          {tag.label}
                        </span>
                      ))}
                    </div>

                    <h2 style={{
                      fontFamily: 'var(--serif)', fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: 700,
                      color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.3, marginBottom: '8px',
                    }}>
                      {article.headline}
                    </h2>

                    {article.excerpt && (
                      <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.65, marginBottom: '10px' }}>
                        {article.excerpt}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--ink-4)', alignItems: 'center' }}>
                      <span>{article.dateShort}</span>
                      {pubTime && <span>{pubTime} CET</span>}
                      <span>{article.readTime} min read</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          <div style={{ marginTop: '48px', padding: '16px 20px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', borderRadius: '3px', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.65 }}>
            Flash Intelligence is generated by AI from public news sources during EU market hours (Mon–Fri, 08:00–17:30 CET).
            For general information purposes only. Not personalised investment advice under MiFID II Article 24.{' '}
            <Link href="/disclaimer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Full disclaimer &#8594;</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
