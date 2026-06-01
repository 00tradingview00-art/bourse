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
import { BRIEFS } from '@/lib/data'

export default function Home() {
  const todaysBrief = BRIEFS[0]
  return (
    <>
      <Ticker />
      <Navbar />
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 32px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '80px', alignItems: 'start' }}>
          <HeroLeft />
          <TodaysBrief brief={todaysBrief} />
        </div>
      </section>
      <MarketDashboard />
      <FeaturesGrid />
      <BriefsArchive />
      <CoverageSection />
      <Newsletter />
      <Footer />
    </>
  )
}
