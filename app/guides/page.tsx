import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import GuidesClient from './GuidesClient'

export const metadata: Metadata = {
  title: 'Investor Guides — European ETF & Tax Explained | Boursee',
  description: 'Plain-English guides on the tax rules that matter most for European investors: Dutch Box 3, German Vorabpauschale, and the French PEA.',
}

const GUIDES = [
  {
    href: '/guides/dutch-box-3',
    flag: '🇳🇱',
    country: 'Netherlands',
    title: 'Dutch Box 3 Explained',
    subtitle: 'Wealth tax on investments — how it works, acc vs dist, and what changes in 2028',
    tags: ['Box 3', 'Wealth Tax', 'ETF Investing'],
    readTime: '6 min',
  },
  {
    href: '/guides/german-vorabpauschale',
    flag: '🇩🇪',
    country: 'Germany',
    title: 'German Vorabpauschale 2026',
    subtitle: 'The annual "pre-tax" on accumulating ETFs — what it is, how it is calculated, and how much you actually pay',
    tags: ['Vorabpauschale', 'ETF Tax', 'Accumulating'],
    readTime: '7 min',
  },
  {
    href: '/guides/french-pea',
    flag: '🇫🇷',
    country: 'France',
    title: 'French PEA: Which ETFs Qualify?',
    subtitle: 'The 75% EU rule, why IWDA and VWCE are blocked, and how to build a world portfolio inside the PEA',
    tags: ['PEA', 'ETF Eligibility', 'Tax Wrapper'],
    readTime: '5 min',
  },
]

export default function GuidesIndex() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '80vh' }}>

        <div style={{ borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 32px 40px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-mid)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '24px', height: '1px', background: 'var(--accent-mid)', display: 'inline-block' }} />
              Investor Education
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '16px', lineHeight: 1.15 }}>
              European Investor Guides
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ink-3)', maxWidth: '560px', lineHeight: 1.65 }}>
              Plain-English explanations of the tax rules that determine your actual returns as a European investor. No jargon, no financial advice — just the facts.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 32px 96px' }}>
          <GuidesClient guides={GUIDES} />

          <div style={{ marginTop: '48px', padding: '20px 24px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', borderRadius: '3px', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.65 }}>
            Guides produced for general information purposes only. Not personalised tax or investment advice. Tax rules change — verify current rates with your local tax authority or a qualified adviser.{' '}
            <Link href="/disclaimer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Full disclaimer →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
