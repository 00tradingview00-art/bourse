import { readFile } from 'fs/promises'
import { join } from 'path'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sector Heatmap | Boursee',
  description: 'European equity sector performance across AEX, DAX, CAC 40, FTSE 100, IBEX 35 and FTSE MIB — visualised by daily change.',
}

interface Stock {
  type?: string
  ticker: string
  name: string
  exchange: string
  sector: string
  changePct: number
}

interface ScreenerData {
  updatedAt: string
  stocks?: Stock[]
  instruments?: Stock[]
}

const EXCHANGES = ['AEX', 'DAX', 'CAC', 'FTSE', 'IBEX', 'FTSE_MIB'] as const
const EXCHANGE_LABELS: Record<string, string> = {
  AEX: 'AEX', DAX: 'DAX', CAC: 'CAC 40', FTSE: 'FTSE 100', IBEX: 'IBEX 35', FTSE_MIB: 'FTSE MIB',
}
const SECTORS = [
  'Technology', 'Financials', 'Healthcare', 'Consumer', 'Industrials',
  'Energy', 'Utilities', 'Materials', 'Telecoms', 'Autos', 'Defence', 'Real Estate',
]

type HeatCell = { avg: number; count: number } | null

function computeMatrix(stocks: Stock[]): Record<string, Record<string, HeatCell>> {
  const acc: Record<string, Record<string, { total: number; count: number }>> = {}
  for (const s of stocks) {
    if (s.type === 'etf') continue
    const { sector, exchange } = s
    if (!SECTORS.includes(sector)) continue
    if (!acc[sector]) acc[sector] = {}
    if (!acc[sector][exchange]) acc[sector][exchange] = { total: 0, count: 0 }
    acc[sector][exchange].total += s.changePct
    acc[sector][exchange].count += 1
  }
  const matrix: Record<string, Record<string, HeatCell>> = {}
  for (const sector of SECTORS) {
    matrix[sector] = {}
    for (const ex of EXCHANGES) {
      const cell = acc[sector]?.[ex]
      matrix[sector][ex] = cell ? { avg: cell.total / cell.count, count: cell.count } : null
    }
  }
  return matrix
}

function sectorAll(matrix: Record<string, Record<string, HeatCell>>, sector: string): HeatCell {
  let total = 0, count = 0
  for (const ex of EXCHANGES) {
    const c = matrix[sector][ex]
    if (c) { total += c.avg * c.count; count += c.count }
  }
  return count > 0 ? { avg: total / count, count } : null
}

function heatColor(pct: number): { bg: string; text: string } {
  if (pct >= 2.5) return { bg: '#1a4a2e', text: '#fff' }
  if (pct >= 1.5) return { bg: '#2d6a4f', text: '#fff' }
  if (pct >= 0.5) return { bg: '#b7e4c7', text: '#1a3a22' }
  if (pct >= -0.5) return { bg: '#f5f5f2', text: '#777' }
  if (pct >= -1.5) return { bg: '#fecaca', text: '#991b1b' }
  if (pct >= -2.5) return { bg: '#ef4444', text: '#fff' }
  return { bg: '#dc2626', text: '#fff' }
}

function HeatCell({ cell, exchange, sector }: { cell: HeatCell; exchange: string; sector: string }) {
  if (!cell) {
    return (
      <td style={{ padding: '10px 8px', textAlign: 'center', fontSize: '12px', color: '#ccc', background: '#fafaf8', borderRight: '1px solid var(--border)' }}>
        —
      </td>
    )
  }
  const { bg, text } = heatColor(cell.avg)
  const sign = cell.avg >= 0 ? '+' : ''
  const filterParams = new URLSearchParams({ exchange, sector })
  return (
    <td style={{ padding: 0, borderRight: '1px solid var(--border)' }}>
      <Link
        href={`/screener?${filterParams}`}
        style={{ display: 'block', padding: '10px 8px', background: bg, color: text, textAlign: 'center', textDecoration: 'none', height: '100%' }}
      >
        <div style={{ fontSize: '13px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>
          {sign}{cell.avg.toFixed(2)}%
        </div>
        <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '2px' }}>
          {cell.count} stock{cell.count !== 1 ? 's' : ''}
        </div>
      </Link>
    </td>
  )
}

export default async function SectorsPage() {
  let data: ScreenerData | null = null
  try {
    const raw = await readFile(join(process.cwd(), 'data', 'screener.json'), 'utf8')
    data = JSON.parse(raw)
  } catch { /* fall through */ }

  const stocks = ((data?.stocks ?? data?.instruments ?? []) as Stock[]).filter(s => s.type !== 'etf')
  const matrix = computeMatrix(stocks)

  // Compute sector averages for the summary strip
  const sectorAvgs = SECTORS.map(s => ({ sector: s, cell: sectorAll(matrix, s) }))
    .filter(x => x.cell !== null)
    .sort((a, b) => (b.cell!.avg) - (a.cell!.avg))

  const topSector = sectorAvgs[0]
  const worstSector = sectorAvgs[sectorAvgs.length - 1]

  const updatedLabel = data?.updatedAt
    ? new Date(data.updatedAt).toLocaleString('en-GB', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
        timeZone: 'Europe/Amsterdam',
      }) + ' CET'
    : null

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', background: 'var(--paper)' }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)', background: '#fff', padding: '40px 0 32px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--accent-mid)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px', height: '1px', background: 'var(--accent-mid)', display: 'inline-block' }} />
              Markets
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '10px' }}>
              Sector Performance Heatmap
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--ink-3)', maxWidth: '580px', lineHeight: 1.6 }}>
              Average daily change by sector across AEX, DAX, CAC 40, FTSE 100, IBEX 35, and FTSE MIB.
              Click any cell to open the screener for that sector and exchange.
            </p>

            {/* Summary strip */}
            {(topSector || worstSector) && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                {topSector?.cell && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '8px 14px' }}>
                    <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Top sector</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>{topSector.sector}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a' }}>+{topSector.cell.avg.toFixed(2)}%</span>
                  </div>
                )}
                {worstSector?.cell && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '4px', padding: '8px 14px' }}>
                    <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Lagging</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>{worstSector.sector}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#dc2626' }}>{worstSector.cell.avg.toFixed(2)}%</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Heatmap table */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 32px 48px' }}>
          {stocks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 32px', color: 'var(--ink-3)', fontSize: '15px' }}>
              Screener data unavailable — check back after 18:30 CET.
            </div>
          ) : (
            <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '6px', background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '680px' }}>
                <thead>
                  <tr style={{ background: 'var(--paper)', borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', borderRight: '1px solid var(--border)', minWidth: '120px' }}>
                      Sector
                    </th>
                    {EXCHANGES.map(ex => (
                      <th key={ex} style={{ padding: '12px 8px', textAlign: 'center', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-3)', borderRight: '1px solid var(--border)' }}>
                        {EXCHANGE_LABELS[ex]}
                      </th>
                    ))}
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-4)', minWidth: '80px' }}>
                      All Exch.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SECTORS.map((sector, i) => {
                    const allCell = sectorAll(matrix, sector)
                    return (
                      <tr key={sector} style={{ borderBottom: i < SECTORS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <td style={{ padding: '0 16px', height: '52px', fontWeight: 600, fontSize: '13px', color: 'var(--ink)', borderRight: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                          {sector}
                        </td>
                        {EXCHANGES.map(ex => (
                          <HeatCell key={ex} cell={matrix[sector][ex]} exchange={ex} sector={sector} />
                        ))}
                        {/* All exchanges aggregate */}
                        <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                          {allCell ? (
                            <div style={{ fontSize: '13px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: allCell.avg >= 0 ? '#16a34a' : '#dc2626' }}>
                              {allCell.avg >= 0 ? '+' : ''}{allCell.avg.toFixed(2)}%
                            </div>
                          ) : (
                            <span style={{ color: '#ccc', fontSize: '12px' }}>—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: 'var(--ink-4)', marginRight: '4px' }}>Scale:</span>
            {[
              { label: '< −2.5%', bg: '#dc2626', text: '#fff' },
              { label: '−1.5%', bg: '#ef4444', text: '#fff' },
              { label: '−0.5%', bg: '#fecaca', text: '#991b1b' },
              { label: 'Flat', bg: '#f5f5f2', text: '#777' },
              { label: '+0.5%', bg: '#b7e4c7', text: '#1a3a22' },
              { label: '+1.5%', bg: '#2d6a4f', text: '#fff' },
              { label: '> +2.5%', bg: '#1a4a2e', text: '#fff' },
            ].map(({ label, bg, text }) => (
              <span key={label} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '2px', background: bg, color: text, fontWeight: 500 }}>
                {label}
              </span>
            ))}
          </div>

          {/* Footnote */}
          <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--ink-4)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
            <span>{stocks.length} stocks across 6 exchanges · click a cell to open screener filter</span>
            {updatedLabel && <span>Data updated {updatedLabel} · prices may be delayed up to 15 min</span>}
          </div>

          {/* Sector breakdown bars */}
          <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 700, color: 'var(--ink)', marginBottom: '20px', letterSpacing: '-0.01em' }}>
              Cross-Exchange Sector Rankings
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
              {sectorAvgs.map(({ sector, cell }) => {
                if (!cell) return null
                const { bg, text } = heatColor(cell.avg)
                const sign = cell.avg >= 0 ? '+' : ''
                const barWidth = Math.min(100, Math.abs(cell.avg) / 3 * 100)
                const barBg = cell.avg >= 0 ? '#b7e4c7' : '#fecaca'
                const barFill = cell.avg >= 0 ? '#1a4a2e' : '#dc2626'
                return (
                  <Link
                    key={sector}
                    href={`/screener?sector=${encodeURIComponent(sector)}`}
                    style={{ display: 'block', textDecoration: 'none', background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '14px 16px', transition: 'border-color 0.15s' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{sector}</span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: cell.avg >= 0 ? '#16a34a' : '#dc2626', fontVariantNumeric: 'tabular-nums' }}>
                        {sign}{cell.avg.toFixed(2)}%
                      </span>
                    </div>
                    <div style={{ height: '4px', background: barBg, borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${barWidth}%`, background: barFill, borderRadius: '2px', marginLeft: cell.avg < 0 ? `${100 - barWidth}%` : 0 }} />
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '6px' }}>
                      {cell.count} stocks across all exchanges
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
