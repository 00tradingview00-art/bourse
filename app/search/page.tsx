import type { Metadata } from 'next'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import SearchClient from './SearchClient'
import { readFile } from 'fs/promises'
import { join } from 'path'
import type { ScreenerStock, ScreenerETF } from '@/app/screener/page'

export const metadata: Metadata = {
  title: 'Ask Boursee — European Market Intelligence | Boursee',
  description: 'Ask anything about European stocks, UCITS ETFs, tax rules, and market dynamics. AI-powered answers with relevant instruments and guides.',
}

interface ScreenerData {
  stockCount?: number
  etfCount?: number
  stocks?: ScreenerStock[]
  etfs?: ScreenerETF[]
  instruments?: (ScreenerStock | ScreenerETF)[]
}

export default async function SearchPage() {
  let instruments: (ScreenerStock | ScreenerETF)[] = []
  let stockCount = 0
  let etfCount = 0

  try {
    const raw = await readFile(join(process.cwd(), 'data', 'screener.json'), 'utf8')
    const d: ScreenerData = JSON.parse(raw)
    const stocks = (d.stocks ?? d.instruments ?? []) as ScreenerStock[]
    const etfs = d.etfs ?? []
    instruments = [...stocks, ...etfs]
    stockCount = d.stockCount ?? stocks.length
    etfCount = d.etfCount ?? etfs.length
  } catch {
    // proceed with empty
  }

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '80vh' }}>
        <SearchClient instruments={instruments} stockCount={stockCount} etfCount={etfCount} />
      </main>
      <Footer />
    </>
  )
}
