import type { Metadata } from 'next'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import WatchlistClient from './WatchlistClient'
import screenerData from '@/data/screener.json'

export const metadata: Metadata = {
  title: 'My Watchlist | Boursee',
  description: 'Track European stocks and ETFs you are monitoring on Boursee.',
}

export default function WatchlistPage() {
  const d = screenerData as Record<string, unknown>
  const stocks = (d.stocks ?? d.instruments ?? []) as Record<string, unknown>[]
  const etfs   = (d.etfs ?? []) as Record<string, unknown>[]
  const all    = [...stocks, ...etfs]

  return (
    <>
      <Navbar />
      <WatchlistClient allItems={all} />
      <Footer />
    </>
  )
}
