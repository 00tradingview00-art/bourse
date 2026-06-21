import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export const metadata: Metadata = {
  title: 'About Boursee — Who Built It and Why | European Market Intelligence',
  description: 'Boursee was built by Prabal Kapoor, a finance professional and former ICICI Prudential AMC wealth manager, to give European retail investors a daily macro-to-equity intelligence platform in English.',
}

const PRINCIPLES = [
  {
    title: 'Know what is happening',
    body: 'A daily brief at 6:30 AM CET covering the moves that matter — European indices, commodities, currencies, and the macro signals that drive them. The Macro–Equity Bridge connects the dots: how a Brent crude drop flows into Shell\'s margins, how EUR/USD moves affect export-heavy DAX names.',
  },
  {
    title: 'Know the rules',
    body: "Investing in Europe without understanding Box 3, Vorabpauschale, or PEA eligibility is investing blind. Each country taxes investment returns differently — and most English-language platforms ignore this entirely. Boursee's guides exist because the rules change how you should structure a portfolio, not just how you file taxes.",
  },
  {
    title: 'Act with data',
    body: 'The screener covers 180+ stocks and 20 UCITS ETFs across AEX, DAX, CAC 40, FTSE 100, IBEX 35, and FTSE MIB — with RSI, MACD, SuperTrend signals, analyst grades, dividend yields, and broker availability on DEGIRO and Trade Republic. Data without context is noise. Context without data is opinion.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '80vh' }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 32px 40px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '20px' }}>
              About
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '20px', lineHeight: 1.1 }}>
              Why I built Boursee
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ink-3)', lineHeight: 1.7, maxWidth: '600px' }}>
              A platform for European retail investors who want to understand the market, not just track it.
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 32px 96px' }}>

          {/* Founder narrative */}
          <div style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--ink)', marginBottom: '48px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p>
              I spent years advising HNIs, family offices, and distribution partners on portfolios worth ₹400 Crore+ as part of the Investor Relations team at ICICI Prudential Asset Management Company — one of India's largest fund houses. Mutual funds, PMS, AIFs. The conversations were about asset allocation, macro positioning, and why a policy shift in Washington or a supply cut in Riyadh changes what your portfolio should look like on Monday morning.
            </p>
            <p>
              When I started looking at European markets for personal investing, I couldn't find a single English-language platform that gave me what I needed: a daily brief that explained not just what moved, but why — and what it meant for specific European stocks. The US financial media covered S&P 500 obsessively. Dutch, German, and French platforms existed but required the local language. Expat investing forums offered opinions but not analysis.
            </p>
            <p>
              There was also the tax problem. European investors face country-specific rules — Dutch Box 3 notional returns, German Vorabpauschale, French PEA eligibility — that fundamentally change how you should structure a portfolio. Most English-language platforms ignored this entirely. The result was investors making structurally inefficient decisions not because they were wrong about the market, but because they didn't understand the rules.
            </p>
            <p>
              Boursee is what I built to solve both problems. A daily macro-to-equity brief that arrives before European markets open. Tax guides for the three largest retail investing markets in continental Europe. A screener built on real technicals and fundamentals, not just price data. Everything you need to invest in Europe with the same clarity that professionals bring to institutional portfolios.
            </p>
          </div>

          {/* Three pillars */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '40px', marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '28px' }}>
              What Boursee is built on
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {PRINCIPLES.map(p => (
                <div
                  key={p.title}
                  style={{ borderLeft: '2px solid var(--accent)', paddingLeft: '20px' }}
                >
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
                    {p.title}
                  </div>
                  <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--ink-3)', margin: 0 }}>
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sign-off */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '32px', marginBottom: '40px' }}>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)', marginBottom: '16px' }}>
              Boursee is independent. No fund-house affiliation, no broker sponsorship. The screener data, the briefs, and the guides exist because I wanted them to exist — and because I believe there are 400 million Europeans who invest and deserve better tools than what is currently available to them in English.
            </p>
            <p style={{ fontSize: '14px', color: 'var(--ink-3)', fontStyle: 'italic' }}>
              — Prabal Kapoor, Founder · Former Investor Relations, ICICI Prudential Asset Management
            </p>
          </div>

          {/* Quick links to platform */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '40px' }}>
            {[
              { href: '/', label: "Today's Brief", desc: 'Daily macro-equity intelligence' },
              { href: '/screener', label: 'Screener', desc: '180+ stocks, 20 UCITS ETFs' },
              { href: '/guides', label: 'Investor Guides', desc: 'Box 3, Vorabpauschale, PEA' },
              { href: '/macro-bridge', label: 'Macro–Equity Bridge', desc: 'What moves what, and why' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                style={{ display: 'block', padding: '16px 20px', border: '1px solid var(--border)', borderRadius: '4px', textDecoration: 'none' }}
              >
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--ink-4)' }}>{item.desc}</div>
              </Link>
            ))}
          </div>

          {/* MiFID II disclaimer */}
          <div style={{ padding: '16px 20px', background: 'var(--paper-2, #f8f8f6)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', borderRadius: '3px', fontSize: '12px', color: 'var(--ink-4)', lineHeight: 1.65 }}>
            Boursee is a research and data platform. Content is for informational purposes only and does not constitute investment advice, personalised financial advice, or a recommendation to buy or sell any security. Not regulated under MiFID II Article 24. Past performance is not indicative of future results. Always conduct your own research and consult a qualified financial adviser before making investment decisions.
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
