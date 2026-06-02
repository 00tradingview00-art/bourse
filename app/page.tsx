import Ticker from './components/Ticker'
import Navbar from './components/Navbar'
import TodaysBrief from './components/TodaysBrief'
import MarketDashboard from './components/MarketDashboard'
import FeaturesGrid from './components/FeaturesGrid'
import BriefsArchive from './components/BriefsArchive'
import CoverageSection from './components/CoverageSection'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import HeroLeft from './components/HeroLeft'
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
  const brent = tickerData.find(m => m.ticker === 'BRENT')

  return (
    <>
      <Ticker tickerItems={tickerData} />
      <Navbar />
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 32px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '80px', alignItems: 'start' }}>
          <HeroLeft />
          <TodaysBrief brief={todaysBrief} markets={dashboardData} />
        </div>
      </section>
      <MarketDashboard markets={dashboardData} timestamp={fetchedAt} />
      <FeaturesGrid />
      <BriefsArchive briefs={briefs} />
      <CoverageSection markets={dashboardData} brent={brent} />
      <Newsletter />
      <Footer />
    </>
  )
}
