import Ticker from './components/Ticker'
import Navbar from './components/Navbar'
import MarketPulse from './components/MarketPulse'
import MarketMovers from './components/MarketMovers'
import TodaysBrief from './components/TodaysBrief'
import FeaturesGrid from './components/FeaturesGrid'
import BriefsArchive from './components/BriefsArchive'
import ScreenerTeaser from './components/ScreenerTeaser'
import CoverageSection from './components/CoverageSection'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import { fetchMarkets, getStaticMarkets } from '@/lib/fetchMarkets'
import { fetchBriefs } from '@/lib/fetchBriefs'

async function getMarkets() {
  try {
    return await fetchMarkets()
  } catch {
    return getStaticMarkets()
  }
}

export default async function Home() {
  const [{ tickerData, dashboardData, fetchedAt }, briefs] = await Promise.all([
    getMarkets(),
    fetchBriefs(),
  ])
  const todaysBrief = briefs[0]
  const brent   = tickerData.find(m => m.ticker === 'BZ=F')
  const eurUsd  = tickerData.find(m => m.name === 'EUR/USD')
  const ecbRate = tickerData.find(m => m.name === 'ECB Rate')

  return (
    <>
      <Ticker tickerItems={tickerData} />
      <Navbar />

      {/* Live market pulse — above the fold, data first */}
      <MarketPulse
        markets={dashboardData}
        timestamp={fetchedAt}
        ecbRate={ecbRate}
        eurUsd={eurUsd}
        brent={brent}
      />

      {/* Today's intelligence: brief + movers */}
      <section style={{ background: 'var(--paper)', borderBottom: '1px solid var(--border)' }}>
        <div className="mob-px" style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 32px' }}>
          <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--accent-mid)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '20px', height: '1px', background: 'var(--accent-mid)', display: 'inline-block' }} />
            Today's Intelligence
          </div>
          <div className="mob-stack mob-gap-sm" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px', alignItems: 'start' }}>
            <TodaysBrief brief={todaysBrief} />
            <MarketMovers />
          </div>
        </div>
      </section>

      {/* RSI signal spotlight */}
      <ScreenerTeaser />

      {/* Brief archive */}
      <BriefsArchive briefs={briefs} />

      {/* Intelligence feature grid */}
      <FeaturesGrid />

      {/* Exchange coverage */}
      <CoverageSection markets={dashboardData} brent={brent} />

      <Newsletter />
      <Footer />
    </>
  )
}
