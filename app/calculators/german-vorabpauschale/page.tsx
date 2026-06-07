'use client'

import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'

const BASE_RATE_2026 = 0.032
const BASE_FACTOR = 0.7
const TAX_RATE = 0.26375

const FUND_TYPES = [
  { id: 'equity',     label: 'Equity fund (≥51% equities)',          teilfreistellung: 0.30 },
  { id: 'mixed',      label: 'Mixed fund (25–50% equities)',          teilfreistellung: 0.15 },
  { id: 'real-estate',label: 'Real estate fund (≥51% property)',      teilfreistellung: 0.60 },
  { id: 'bond',       label: 'Bond / money market fund',              teilfreistellung: 0.00 },
] as const

type FundTypeId = typeof FUND_TYPES[number]['id']

function fmtDec(n: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

interface Result {
  basisertrag: number
  vorabpauschale: number
  taxableVP: number
  teilfreistellungPct: number
  grossTax: number
  fsaOffset: number
  netTax: number
  fsaRemaining: number
}

function compute(fundValue: number, fundTypeId: FundTypeId, fundGain: number | null, fsa: number): Result {
  const ft = FUND_TYPES.find(f => f.id === fundTypeId)!
  const basisertrag = fundValue * BASE_RATE_2026 * BASE_FACTOR
  // Vorabpauschale capped at actual gain (if provided), and 0 if fund declined
  const vorabpauschale = fundGain !== null
    ? Math.min(Math.max(0, fundGain), basisertrag)
    : basisertrag
  const taxableVP = vorabpauschale * (1 - ft.teilfreistellung)
  const grossTax = taxableVP * TAX_RATE
  const fsaUsed = Math.min(taxableVP, fsa)
  const fsaOffset = fsaUsed * TAX_RATE
  const netTax = Math.max(0, grossTax - fsaOffset)
  const fsaRemaining = Math.max(0, fsa - taxableVP)
  return { basisertrag, vorabpauschale, taxableVP, teilfreistellungPct: ft.teilfreistellung, grossTax, fsaOffset, netTax, fsaRemaining }
}

function NumInput({ label, value, onChange, hint, prefix = '€' }: { label: string; value: number; onChange: (v: number) => void; hint?: string; prefix?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>{label}</label>
      {hint && <span style={{ fontSize: '11px', color: 'var(--ink-4)' }}>{hint}</span>}
      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
        <span style={{ padding: '10px 12px', background: 'var(--paper)', borderRight: '1px solid var(--border)', fontSize: '13px', color: 'var(--ink-3)', fontWeight: 500 }}>{prefix}</span>
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

function ResultRow({ label, value, sub, bold, green, indent, muted }: { label: string; value: string; sub?: string; bold?: boolean; green?: boolean; indent?: boolean; muted?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: '1px solid var(--paper-2)', gap: '12px' }}>
      <span style={{ fontSize: bold ? '14px' : '13px', fontWeight: bold ? 700 : 400, color: muted ? 'var(--ink-4)' : green ? 'var(--accent)' : 'var(--ink)', paddingLeft: indent ? '14px' : 0, display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        {indent && <span style={{ color: 'var(--ink-4)', fontSize: '11px' }}>└</span>}
        {label}
        {sub && <span style={{ fontSize: '11px', color: 'var(--ink-4)' }}>{sub}</span>}
      </span>
      <span style={{ fontSize: bold ? '15px' : '13px', fontWeight: bold ? 700 : 500, color: muted ? 'var(--ink-4)' : green ? '#16a34a' : 'var(--ink)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
        {value}
      </span>
    </div>
  )
}

export default function VorabpauschaleCalculator() {
  const [fundValue, setFundValue] = useState(0)
  const [fundType, setFundType] = useState<FundTypeId>('equity')
  const [useGain, setUseGain] = useState(false)
  const [fundGain, setFundGain] = useState(0)
  const [fsa, setFsa] = useState(1000)

  const r = compute(fundValue, fundType, useGain ? fundGain : null, fsa)
  const ft = FUND_TYPES.find(f => f.id === fundType)!

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', background: 'var(--paper)' }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)', background: '#fff', padding: '32px 0 28px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 32px' }}>
            <div style={{ fontSize: '12px', color: 'var(--ink-4)', marginBottom: '14px' }}>
              <Link href="/calculators" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Calculators</Link>
              <span style={{ margin: '0 6px' }}>›</span>
              Vorabpauschale 2026
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
              <span style={{ fontSize: '32px' }}>🇩🇪</span>
              <div>
                <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  Vorabpauschale Calculator
                </h1>
                <div style={{ fontSize: '13px', color: 'var(--accent-mid)', fontWeight: 500, marginTop: '4px' }}>
                  2026 · base rate 3.20% · Abgeltungsteuer 26.375%
                </div>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6, maxWidth: '540px' }}>
              Calculates the January advance lump-sum tax (Vorabpauschale) on ETF holdings in a German depot. All calculations run locally in your browser.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 32px 64px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>

            {/* Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--paper)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Fund details</div>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <NumInput
                    label="Fund value on 1 Jan 2026"
                    value={fundValue}
                    onChange={setFundValue}
                    hint="Your holding's NAV at start of year"
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>Fund type</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {FUND_TYPES.map(ft => (
                        <label key={ft.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', border: `1px solid ${fundType === ft.id ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '4px', cursor: 'pointer', background: fundType === ft.id ? 'var(--accent-light)' : '#fff' }}>
                          <input
                            type="radio"
                            name="fundType"
                            value={ft.id}
                            checked={fundType === ft.id}
                            onChange={() => setFundType(ft.id)}
                            style={{ accentColor: 'var(--accent)' }}
                          />
                          <div>
                            <div style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: fundType === ft.id ? 600 : 400 }}>{ft.label}</div>
                            <div style={{ fontSize: '11px', color: 'var(--ink-4)' }}>Teilfreistellung: {(ft.teilfreistellung * 100).toFixed(0)}%</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <NumInput
                    label="Freistellungsauftrag remaining"
                    value={fsa}
                    onChange={setFsa}
                    hint="Annual allowance: €1,000 single, €2,000 joint"
                  />

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: useGain ? '12px' : 0 }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '3px', border: `2px solid ${useGain ? 'var(--accent)' : 'var(--border)'}`, background: useGain ? 'var(--accent)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} onClick={() => setUseGain(u => !u)}>
                        {useGain && <span style={{ color: '#fff', fontSize: '12px', lineHeight: 1 }}>✓</span>}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>Cap at actual price gain</div>
                        <div style={{ fontSize: '11px', color: 'var(--ink-4)' }}>VP cannot exceed actual 2026 fund appreciation</div>
                      </div>
                    </label>
                    {useGain && (
                      <NumInput
                        label="Actual price gain in 2026"
                        value={fundGain}
                        onChange={setFundGain}
                        hint="Enter 0 if fund declined or was flat"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: r.netTax === 0 && fundValue > 0 ? '#f0fdf4' : 'var(--paper)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '4px' }}>Tax to pay in January 2027</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '36px', fontWeight: 700, color: r.netTax === 0 && fundValue > 0 ? '#16a34a' : 'var(--ink)', letterSpacing: '-0.02em' }}>
                  {fmtDec(r.netTax)}
                </div>
                {r.netTax === 0 && fundValue > 0 && fsa > 0 && (
                  <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px', fontWeight: 500 }}>
                    Covered by Freistellungsauftrag
                  </div>
                )}
              </div>

              {fundValue > 0 && (
                <div style={{ padding: '16px 20px' }}>
                  <ResultRow label={`Basisertrag`} value={fmtDec(r.basisertrag)} sub={`${fundValue.toLocaleString('de-DE')} × 3.20% × 0.7`} />
                  {useGain && fundGain < r.basisertrag && (
                    <ResultRow label="Capped at actual gain" value={fmtDec(r.vorabpauschale)} indent muted />
                  )}
                  <ResultRow label="Vorabpauschale" value={fmtDec(r.vorabpauschale)} bold />

                  {ft.teilfreistellung > 0 && (
                    <ResultRow
                      label={`After Teilfreistellung`}
                      value={fmtDec(r.taxableVP)}
                      sub={`×${(1 - ft.teilfreistellung) * 100}%`}
                      indent
                    />
                  )}
                  <ResultRow label="Taxable VP" value={fmtDec(r.taxableVP)} bold />
                  <ResultRow label="Gross tax (26.375%)" value={fmtDec(r.grossTax)} />
                  {r.fsaOffset > 0 && (
                    <ResultRow label="FSA offset" value={`– ${fmtDec(r.fsaOffset)}`} indent muted />
                  )}
                  <ResultRow label="Net tax owed" value={fmtDec(r.netTax)} bold green />
                  {r.fsaRemaining > 0 && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--ink-4)' }}>
                      FSA remaining after VP: {fmtDec(r.fsaRemaining)}
                    </div>
                  )}
                </div>
              )}

              {fundValue === 0 && (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ink-4)', fontSize: '13px' }}>
                  Enter your fund value on the left to calculate
                </div>
              )}
            </div>
          </div>

          {/* Formula reference */}
          <div style={{ marginTop: '32px', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '20px 24px' }}>
            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ink)', marginBottom: '12px' }}>Formula (2026)</div>
            <div style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.8, fontFamily: 'monospace', background: 'var(--paper)', padding: '12px 16px', borderRadius: '4px' }}>
              Basisertrag = Fund value × 3.20% × 0.7<br />
              VP = min(Basisertrag, actual price gain)<br />
              Taxable VP = VP × (1 − Teilfreistellung%)<br />
              Tax = max(0, (Taxable VP − FSA) × 26.375%)
            </div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--ink-4)', lineHeight: 1.7 }}>
              The 0.7 factor (Basiszins-Faktor) was set by the Bundesfinanzministerium for 2026. The Abgeltungsteuer rate of 26.375% includes 25% flat tax + 5.5% Solidaritätszuschlag.
              Kirchensteuer (8–9%) is not included in this estimate.
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/guides/german-vorabpauschale" style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid currentColor', paddingBottom: '1px' }}>
              Full Vorabpauschale guide →
            </Link>
            <span style={{ fontSize: '13px', color: 'var(--ink-4)' }}>·</span>
            <span style={{ fontSize: '13px', color: 'var(--ink-4)' }}>Estimates only. Does not include Kirchensteuer or individual tax situations. Consult a Steuerberater.</span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
