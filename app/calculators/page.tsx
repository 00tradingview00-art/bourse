import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tax Calculators | Boursee',
  description: 'Free European investor tax calculators — Dutch Box 3 wealth tax estimator and German Vorabpauschale calculator for ETF investors.',
}

const CALCS = [
  {
    href: '/calculators/dutch-box-3',
    flag: '🇳🇱',
    title: 'Dutch Box 3 Estimator',
    subtitle: '2025 tax year',
    description: 'Estimate your Box 3 wealth tax based on savings, investments, and property. Applies the 2025 notional return rates and €57,684 threshold.',
    tags: ['Netherlands', 'Wealth Tax', 'Box 3'],
    guide: '/guides/dutch-box-3',
  },
  {
    href: '/calculators/german-vorabpauschale',
    flag: '🇩🇪',
    title: 'Vorabpauschale Calculator',
    subtitle: '2026 base rate: 3.20%',
    description: 'Calculate your Vorabpauschale (advance lump-sum tax) for ETF holdings held in a German depot. Applies Teilfreistellung by fund type and your Freistellungsauftrag.',
    tags: ['Germany', 'ETF Tax', 'Vorabpauschale'],
    guide: '/guides/german-vorabpauschale',
  },
]

export default function CalculatorsPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', background: 'var(--paper)' }}>

        <div style={{ borderBottom: '1px solid var(--border)', background: '#fff', padding: '40px 0 32px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--accent-mid)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px', height: '1px', background: 'var(--accent-mid)', display: 'inline-block' }} />
              Tools
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '10px' }}>
              Tax Calculators
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--ink-3)', maxWidth: '560px', lineHeight: 1.6 }}>
              Tax and portfolio tools for European investors. Runs locally — no data leaves your browser.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px 64px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {CALCS.map(c => (
              <div key={c.href} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', gap: '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '32px' }}>{c.flag}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>{c.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--accent-mid)', fontWeight: 500, marginTop: '2px' }}>{c.subtitle}</div>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.7, marginBottom: '16px' }}>
                  {c.description}
                </p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {c.tags.map(t => (
                    <span key={t} style={{ fontSize: '10px', fontWeight: 500, padding: '2px 8px', borderRadius: '2px', background: 'var(--accent-light)', color: 'var(--accent)', letterSpacing: '0.04em' }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 'auto' }}>
                  <Link href={c.href} style={{ fontSize: '13px', fontWeight: 600, color: '#fff', background: 'var(--accent)', padding: '9px 18px', borderRadius: '3px', textDecoration: 'none' }}>
                    Open calculator →
                  </Link>
                  <Link href={c.guide} style={{ fontSize: '12px', color: 'var(--ink-4)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
                    Read the guide
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '40px', padding: '20px', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--ink)' }}>Disclaimer:</strong> These calculators provide estimates only. Tax rules change annually and individual circumstances vary.
            Always consult a qualified tax adviser before making decisions. Boursee is not a regulated tax or financial adviser.
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
