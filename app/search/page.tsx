import type { Metadata } from 'next'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import SearchClient from './SearchClient'
import screenerData from '@/data/screener.json'
import type { ScreenerStock, ScreenerETF } from '@/app/screener/page'

export const metadata: Metadata = {
  title: 'Search European Stocks & ETFs | Boursee',
  description: 'Search across 170+ European stocks and 20+ UCITS ETFs by name or ticker. AEX, DAX, CAC 40, FTSE 100, IBEX 35, FTSE MIB, OMX Nordic.',
}

export default function SearchPage() {
  const d = screenerData as Record<string, unknown>
  const all = (d.stocks ?? d.etfs ? [...((d.stocks ?? []) as ScreenerStock[]), ...((d.etfs ?? []) as ScreenerETF[])] : (d.instruments ?? []) as (ScreenerStock | ScreenerETF)[])

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '80vh' }}>
        <div style={{ borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 32px 40px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-mid)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '24px', height: '1px', background: 'var(--accent-mid)', display: 'inline-block' }} />
              Instrument Search
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.15 }}>
              Search Stocks & ETFs
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--ink-4)', marginTop: '10px' }}>
              {(d.stockCount as number ?? 0)} stocks · {(d.etfCount as number ?? 0)} ETFs · AEX · DAX · CAC 40 · FTSE 100 · IBEX 35 · FTSE MIB · OMX Nordic
            </p>
          </div>
        </div>
        <SearchClient instruments={all as (ScreenerStock | ScreenerETF)[]} />
      </main>
      <Footer />
    </>
  )
}
