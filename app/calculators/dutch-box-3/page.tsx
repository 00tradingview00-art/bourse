'use client'

import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'

const RATES_2025 = {
  savings: 0.0103,
  investments: 0.0588,
  property: 0.0247,
}
const TAX_RATE = 0.36
const THRESHOLD_PER_PERSON = 57684

function fmt(n: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

function fmtDec(n: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

interface Result {
  totalAssets: number
  threshold: number
  taxableCapital: number
  savingsPortion: number
  investmentsPortion: number
  propertyPortion: number
  notionalSavings: number
  notionalInvestments: number
  notionalProperty: number
  totalNotional: number
  taxOwed: number
  effectiveRate: number
}

function compute(savings: number, investments: number, property: number, partners: boolean): Result {
  const totalAssets = savings + investments + property
  const threshold = THRESHOLD_PER_PERSON * (partners ? 2 : 1)
  const taxableCapital = Math.max(0, totalAssets - threshold)

  if (taxableCapital === 0 || totalAssets === 0) {
    return { totalAssets, threshold, taxableCapital: 0, savingsPortion: 0, investmentsPortion: 0, propertyPortion: 0, notionalSavings: 0, notionalInvestments: 0, notionalProperty: 0, totalNotional: 0, taxOwed: 0, effectiveRate: 0 }
  }

  const savingsFrac = savings / totalAssets
  const investFrac = investments / totalAssets
  const propFrac = property / totalAssets

  const savingsPortion = taxableCapital * savingsFrac
  const investmentsPortion = taxableCapital * investFrac
  const propertyPortion = taxableCapital * propFrac

  const notionalSavings = savingsPortion * RATES_2025.savings
  const notionalInvestments = investmentsPortion * RATES_2025.investments
  const notionalProperty = propertyPortion * RATES_2025.property
  const totalNotional = notionalSavings + notionalInvestments + notionalProperty
  const taxOwed = totalNotional * TAX_RATE
  const effectiveRate = totalAssets > 0 ? (taxOwed / totalAssets) * 100 : 0

  return { totalAssets, threshold, taxableCapital, savingsPortion, investmentsPortion, propertyPortion, notionalSavings, notionalInvestments, notionalProperty, totalNotional, taxOwed, effectiveRate }
}

function NumInput({ label, value, onChange, hint }: { label: string; value: number; onChange: (v: number) => void; hint?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>{label}</label>
      {hint && <span style={{ fontSize: '11px', color: 'var(--ink-4)' }}>{hint}</span>}
      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
        <span style={{ padding: '10px 12px', background: 'var(--paper)', borderRight: '1px solid var(--border)', fontSize: '13px', color: 'var(--ink-3)', fontWeight: 500 }}>€</span>
        <input
          type="number"
          min={0}
          value={value || ''}
          onChange={e => onChange(Math.max(0, parseFloat(e.target.value) || 0))}
          style={{ flex: 1, padding: '10px 12px', fontSize: '14px', border: 'none', outline: 'none', fontVariantNumeric: 'tabular-nums', color: 'var(--ink)', background: 'transparent' }}
          placeholder="0"
        />
      </div>
    </div>
  )
}

function ResultRow({ label, value, sub, bold, green, indent }: { label: string; value: string; sub?: string; bold?: boolean; green?: boolean; indent?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: '1px solid var(--paper-2)', gap: '12px' }}>
      <span style={{ fontSize: bold ? '14px' : '13px', fontWeight: bold ? 700 : 400, color: green ? 'var(--accent)' : 'var(--ink)', paddingLeft: indent ? '14px' : 0, display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        {indent && <span style={{ color: 'var(--ink-4)', fontSize: '11px' }}>└</span>}
        {label}
        {sub && <span style={{ fontSize: '11px', color: 'var(--ink-4)' }}>{sub}</span>}
      </span>
      <span style={{ fontSize: bold ? '15px' : '13px', fontWeight: bold ? 700 : 500, color: green ? '#16a34a' : 'var(--ink)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
        {value}
      </span>
    </div>
  )
}

export default function Box3Calculator() {
  const [savings, setSavings] = useState(0)
  const [investments, setInvestments] = useState(0)
  const [property, setProperty] = useState(0)
  const [partners, setPartners] = useState(false)

  const r = compute(savings, investments, property, partners)

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', background: 'var(--paper)' }}>

        {/* Breadcrumb + header */}
        <div style={{ borderBottom: '1px solid var(--border)', background: '#fff', padding: '32px 0 28px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 32px' }}>
            <div style={{ fontSize: '12px', color: 'var(--ink-4)', marginBottom: '14px' }}>
              <Link href="/calculators" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Calculators</Link>
              <span style={{ margin: '0 6px' }}>›</span>
              Dutch Box 3
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
              <span style={{ fontSize: '32px' }}>🇳🇱</span>
              <div>
                <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  Dutch Box 3 Estimator
                </h1>
                <div style={{ fontSize: '13px', color: 'var(--accent-mid)', fontWeight: 500, marginTop: '4px' }}>
                  2025 tax year · notional return system
                </div>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6, maxWidth: '540px' }}>
              Estimates your Box 3 (wealth tax) liability based on 2025 notional return rates. All calculations run locally in your browser.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 32px 64px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>

            {/* Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--paper)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Your assets on 1 Jan 2025</div>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <NumInput
                    label="Bank savings"
                    value={savings}
                    onChange={setSavings}
                    hint="Current accounts, savings accounts — notional rate 1.03%"
                  />
                  <NumInput
                    label="Investments"
                    value={investments}
                    onChange={setInvestments}
                    hint="Stocks, ETFs, bonds, crypto — notional rate 5.88%"
                  />
                  <NumInput
                    label="Other property"
                    value={property}
                    onChange={setProperty}
                    hint="Rental property, second home — notional rate 2.47%"
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--paper)', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setPartners(p => !p)}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '3px', border: `2px solid ${partners ? 'var(--accent)' : 'var(--border)'}`, background: partners ? 'var(--accent)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {partners && <span style={{ color: '#fff', fontSize: '12px', lineHeight: 1 }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>Tax partners</div>
                      <div style={{ fontSize: '11px', color: 'var(--ink-4)' }}>Doubles threshold to €{(THRESHOLD_PER_PERSON * 2).toLocaleString('nl-NL')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rates reference */}
              <div style={{ marginTop: '16px', padding: '14px 16px', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.7 }}>
                <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>2025 notional return rates</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2px 12px' }}>
                  <span>Savings</span><span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>1.03%</span>
                  <span>Investments</span><span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>5.88%</span>
                  <span>Property</span><span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>2.47%</span>
                  <span>Tax rate</span><span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>36%</span>
                  <span>Threshold</span><span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>€57,684</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: r.taxOwed > 0 ? 'var(--paper)' : '#f0fdf4' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '4px' }}>Estimated tax</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '36px', fontWeight: 700, color: r.taxOwed > 0 ? 'var(--ink)' : '#16a34a', letterSpacing: '-0.02em' }}>
                  {fmtDec(r.taxOwed)}
                </div>
                {r.taxOwed === 0 && r.totalAssets > 0 && (
                  <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px', fontWeight: 500 }}>
                    Below threshold — no Box 3 tax due
                  </div>
                )}
                {r.taxOwed > 0 && (
                  <div style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '4px' }}>
                    Effective rate: {r.effectiveRate.toFixed(3)}% of total assets
                  </div>
                )}
              </div>

              {r.totalAssets > 0 && (
                <div style={{ padding: '16px 20px' }}>
                  <ResultRow label="Total assets" value={fmt(r.totalAssets)} bold />
                  <ResultRow label="Tax-free threshold" value={`– ${fmt(r.threshold)}`} sub={partners ? '(partners)' : '(single)'} />
                  <ResultRow label="Taxable capital" value={fmt(r.taxableCapital)} bold />

                  {r.taxableCapital > 0 && (
                    <>
                      <div style={{ marginTop: '12px', marginBottom: '4px', fontSize: '11px', fontWeight: 500, color: 'var(--ink-4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Notional return breakdown
                      </div>
                      {r.savingsPortion > 0 && <ResultRow label="Savings" value={fmtDec(r.notionalSavings)} sub={`× 1.03%`} indent />}
                      {r.investmentsPortion > 0 && <ResultRow label="Investments" value={fmtDec(r.notionalInvestments)} sub={`× 5.88%`} indent />}
                      {r.propertyPortion > 0 && <ResultRow label="Property" value={fmtDec(r.notionalProperty)} sub={`× 2.47%`} indent />}
                      <ResultRow label="Total notional return" value={fmtDec(r.totalNotional)} bold />
                      <ResultRow label="Box 3 tax (36%)" value={fmtDec(r.taxOwed)} bold green />
                    </>
                  )}
                </div>
              )}

              {r.totalAssets === 0 && (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ink-4)', fontSize: '13px' }}>
                  Enter your asset values on the left to calculate
                </div>
              )}
            </div>
          </div>

          {/* Callout box */}
          <div style={{ marginTop: '32px', padding: '20px 24px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px' }}>
            <div style={{ fontWeight: 600, fontSize: '13px', color: '#92400e', marginBottom: '6px' }}>Important: 2028 reform</div>
            <p style={{ fontSize: '13px', color: '#78350f', lineHeight: 1.7, margin: 0 }}>
              The Dutch government plans to replace the notional return system with an actual return system from 2028. Under the new system, you will pay 36% tax on your <em>real</em> investment returns (gains + dividends) rather than notional rates. Accumulating ETFs and distributing ETFs will be treated equally. The current system remains in force for 2025 and 2026.
            </p>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/guides/dutch-box-3" style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid currentColor', paddingBottom: '1px' }}>
              Full Box 3 guide →
            </Link>
            <span style={{ fontSize: '13px', color: 'var(--ink-4)' }}>·</span>
            <span style={{ fontSize: '13px', color: 'var(--ink-4)' }}>Estimates only. Consult a Dutch tax adviser (belastingadviseur) for your actual tax position.</span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
