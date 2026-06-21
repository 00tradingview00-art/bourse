import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export const metadata: Metadata = {
  title: 'What is a UCITS ETF? Complete Guide for European Investors | Boursee',
  description: 'UCITS ETFs are the standard for European retail investing. Learn what UCITS means, why it matters, how it protects you, and how to identify a UCITS-compliant fund.',
}

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does UCITS stand for?',
      acceptedAnswer: { '@type': 'Answer', text: 'UCITS stands for Undertakings for Collective Investment in Transferable Securities. It is a European regulatory framework that sets minimum standards for funds sold to retail investors across the EU. UCITS funds can be passported and sold in any EU member state once authorised in one country.' },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between a UCITS ETF and a US ETF?',
      acceptedAnswer: { '@type': 'Answer', text: 'US ETFs (like those from Vanguard or iShares listed on NYSE) are not available to European retail investors under MiFID II regulations, which require a KIID (Key Investor Information Document) that US funds do not produce. European investors must buy UCITS versions of the same funds — for example, CSPX (iShares Core S&P 500 UCITS ETF) instead of IVV or VOO.' },
    },
    {
      '@type': 'Question',
      name: 'Where are most UCITS ETFs domiciled?',
      acceptedAnswer: { '@type': 'Answer', text: 'The majority of UCITS ETFs are domiciled in Ireland or Luxembourg. Ireland is preferred for funds holding US stocks due to the favourable US–Ireland tax treaty, which reduces dividend withholding tax on US equities from 30% to 15%. Luxembourg is also common, particularly for European bond funds.' },
    },
    {
      '@type': 'Question',
      name: 'How do I know if an ETF is UCITS?',
      acceptedAnswer: { '@type': 'Answer', text: 'Look for "UCITS" in the fund name (e.g., "iShares Core MSCI World UCITS ETF") or check the fund documentation. UCITS ETFs must provide a KIID and are typically listed on European exchanges like Euronext Amsterdam, London Stock Exchange, or Xetra. Funds listed on NYSE or NASDAQ are US-domiciled and not UCITS.' },
    },
  ],
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '36px' }}>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>{title}</h2>
      {children}
    </div>
  )
}

function Callout({ type, children }: { type: 'insight' | 'warning' | 'tip'; children: React.ReactNode }) {
  const styles = {
    insight: { bg: '#f0f7ff', border: '#bcd6f5', label: 'Key insight', labelColor: '#1a6bc4' },
    warning: { bg: '#fff8f0', border: '#f5d6a0', label: 'Important', labelColor: '#b85c00' },
    tip:     { bg: '#f0faf4', border: '#a5d6b8', label: 'Practical tip', labelColor: '#1a7a40' },
  }
  const s = styles[type]
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '4px', padding: '16px 20px', margin: '24px 0' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: s.labelColor, marginBottom: '6px' }}>{s.label}</div>
      <div style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--ink)' }}>{children}</div>
    </div>
  )
}

export default function WhatIsUCITSGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }} />
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '80vh' }}>
        <div style={{ borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 32px 40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Link href="/guides" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none' }}>← All guides</Link>
              <span style={{ color: 'var(--border)' }}>·</span>
              <span style={{ fontSize: '13px', color: 'var(--ink-4)' }}>5 min read</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '26px' }}>🇪🇺</span>
              <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>Europe-wide — ETF Basics</span>
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '16px', lineHeight: 1.15 }}>
              What is a UCITS ETF?
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ink-3)', lineHeight: 1.65, maxWidth: '620px' }}>
              If you invest in Europe, almost every ETF you can buy is a UCITS ETF. Here is what the label means, why it matters, and why European investors cannot simply buy Vanguard funds from the US.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 32px 96px' }}>

          <Section title="What UCITS means">
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)', marginBottom: '16px' }}>
              UCITS — Undertakings for Collective Investment in Transferable Securities — is a European Union regulatory framework for investment funds. A UCITS fund meets a set of minimum standards around diversification, liquidity, investor protection, and disclosure. Once authorised in one EU country, a UCITS fund can be marketed and sold to retail investors across all EU member states without further regulatory approval.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)' }}>
              Most of the ETFs traded on Euronext Amsterdam, Xetra, and the London Stock Exchange are UCITS ETFs. The names usually make it explicit: "iShares Core MSCI World UCITS ETF", "Vanguard FTSE All-World UCITS ETF", "Amundi MSCI Emerging Markets UCITS ETF".
            </p>
          </Section>

          <Section title="Why European investors cannot buy US ETFs">
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)', marginBottom: '16px' }}>
              Under MiFID II, funds sold to European retail investors must provide a standardised Key Information Document (KID). US-domiciled ETFs — such as VOO, IVV, or QQQ from Vanguard and iShares listed on NYSE — do not produce a KID. This means European brokers cannot legally sell them to retail clients.
            </p>
            <Callout type="insight">
              If you have seen Reddit threads about "buying VOO in Europe" — the short answer is: you cannot, unless you are classified as a professional investor. The UCITS equivalent of VOO is VUSA (Vanguard S&P 500 UCITS ETF) or CSPX (iShares Core S&P 500 UCITS ETF).
            </Callout>
          </Section>

          <Section title="UCITS investor protections">
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)', marginBottom: '16px' }}>
              The UCITS framework sets hard limits on how a fund can invest:
            </p>
            <ul style={{ fontSize: '15px', lineHeight: 1.9, color: 'var(--ink)', paddingLeft: '24px', marginBottom: '16px' }}>
              <li><strong>Diversification:</strong> No more than 10% of assets in a single issuer (5% for most cases).</li>
              <li><strong>Liquidity:</strong> Must be able to redeem investors within a defined timeframe (typically daily).</li>
              <li><strong>Leverage:</strong> Limited leverage, no more than 2× for UCITS ETFs.</li>
              <li><strong>Custody:</strong> Assets must be held by an independent depositary (custodian), separate from the fund manager.</li>
              <li><strong>Disclosure:</strong> Must publish a KID, prospectus, and semi-annual/annual reports.</li>
            </ul>
            <Callout type="tip">
              The depositary requirement is important: if an ETF provider like iShares fails, your assets are held by a separate custodian and are not part of the bankruptcy estate.
            </Callout>
          </Section>

          <Section title="Ireland vs Luxembourg: where UCITS ETFs live">
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)', marginBottom: '16px' }}>
              Most large UCITS ETFs are domiciled in Ireland or Luxembourg. The choice of domicile affects dividend withholding tax — particularly on US dividend income.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)' }}>
              Ireland has a tax treaty with the US that reduces dividend withholding tax on US equities from 30% to 15%. Luxembourg pays 30% on US dividends. This means for a fund tracking the S&P 500 or MSCI World, an Irish-domiciled ETF retains more dividend income before passing it to investors. For equity ETFs covering US stocks, Ireland is the better domicile.
            </p>
          </Section>

          <Section title="Accumulating vs distributing UCITS ETFs">
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)', marginBottom: '16px' }}>
              UCITS ETFs come in two structures:
            </p>
            <ul style={{ fontSize: '15px', lineHeight: 1.9, color: 'var(--ink)', paddingLeft: '24px' }}>
              <li><strong>Accumulating (Acc):</strong> Dividends are reinvested inside the fund. No cash distribution. The fund price grows to reflect reinvested income. Examples: IWDA, VWCE, CSPX.</li>
              <li><strong>Distributing (Dist):</strong> Dividends are paid out as cash to investors. Examples: VUSA, VWRL, SWDA.</li>
            </ul>
            <Callout type="insight">
              For most long-term investors in the Netherlands and Germany, accumulating ETFs are tax-efficient for compound growth — but the tax treatment depends on your country. Dutch Box 3 treats both identically. German investors pay Vorabpauschale on accumulating ETFs annually. Check the relevant guide for your country.
            </Callout>
          </Section>

          {/* Screener CTA */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>Browse UCITS ETFs on the screener</div>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6 }}>Filter by domicile (Ireland / Luxembourg), structure (acc / dist), TER, and broker availability on DEGIRO and Trade Republic.</p>
            </div>
            <Link href="/screener" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>Open Screener →</Link>
          </div>

          {/* Related guides */}
          <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>Related guides</div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px' }}>
              <Link href="/guides/dividend-withholding-tax" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Dividend Withholding Tax →</Link>
              <Link href="/guides/etf-accumulating-vs-distributing" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Acc vs Dist ETFs →</Link>
              <Link href="/guides/dutch-box-3" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Dutch Box 3 →</Link>
            </div>
          </div>

          <div style={{ marginTop: '24px', padding: '16px 20px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', borderRadius: '3px', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.65 }}>
            For informational purposes only. Not investment advice under MiFID II Article 24. UCITS rules and fund structures can change — verify current details in the fund prospectus or KIID.
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
