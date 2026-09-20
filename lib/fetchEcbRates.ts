import type { MarketData } from '@/types'

// ECB Data Portal, Deposit Facility Rate (business-day series). Rows are rate changes,
// with the date the new rate took effect.
const DFR_URL =
  'https://data-api.ecb.europa.eu/service/data/FM/B.U2.EUR.4F.KR.DFR.LEV?startPeriod=2023-01-01&format=csvdata&detail=dataonly'

export interface EcbRateChange {
  /** ISO date (YYYY-MM-DD) the new rate took effect */
  effective: string
  rateAfter: number
  /** Change in basis points versus the previous rate */
  changeBp: number
}

export interface EcbRates {
  current: number
  /** ISO date the current rate took effect */
  since: string
  /** Oldest first */
  changes: EcbRateChange[]
}

/**
 * ECB Governing Council monetary-policy decision days (Day 2, press conference).
 * Source: ECB meeting calendar (ecb.europa.eu/press/calendars/mgcgc), checked 2026-09-20.
 * Past dates drop out automatically; extend this list when the ECB publishes new dates.
 */
export const ECB_DECISION_DAYS = ['2026-10-29', '2026-12-17', '2027-02-04']

export async function fetchEcbRates(): Promise<EcbRates | null> {
  try {
    const res = await fetch(DFR_URL, { headers: { Accept: 'text/csv' }, next: { revalidate: 21600 }, signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    const lines = (await res.text()).trim().split(/\r?\n/)
    const header = (lines[0]?.split(',') ?? []).map(h => h.trim())
    const iDate = header.indexOf('TIME_PERIOD')
    const iVal = header.indexOf('OBS_VALUE')
    if (iDate < 0 || iVal < 0) return null

    const obs = lines
      .slice(1)
      .map(l => {
        const c = l.split(',')
        return { date: c[iDate]?.trim(), value: parseFloat(c[iVal]) }
      })
      .filter(o => o.date && Number.isFinite(o.value))
      .sort((a, b) => a.date.localeCompare(b.date))
    if (!obs.length) return null

    const changes: EcbRateChange[] = []
    for (let i = 1; i < obs.length; i++) {
      if (obs[i].value !== obs[i - 1].value) {
        changes.push({
          effective: obs[i].date,
          rateAfter: obs[i].value,
          changeBp: Math.round((obs[i].value - obs[i - 1].value) * 100),
        })
      }
    }
    const last = changes[changes.length - 1]
    return {
      current: obs[obs.length - 1].value,
      since: last ? last.effective : obs[0].date,
      changes,
    }
  } catch {
    return null
  }
}

export function formatEcbDate(iso: string, opts: { year?: boolean } = { year: true }): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(opts.year === false ? {} : { year: 'numeric' }),
    timeZone: 'UTC',
  })
}

export function formatBp(bp: number): string {
  return `${bp > 0 ? '+' : bp < 0 ? '−' : ''}${Math.abs(bp)}bp`
}

/** Next scheduled decision on or after today, or null if the calendar above has run out. */
export function nextEcbDecision(now: Date = new Date()): { date: string; daysAway: number } | null {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  for (const d of ECB_DECISION_DAYS) {
    const t = Date.parse(`${d}T00:00:00Z`)
    if (t >= today) return { date: d, daysAway: Math.round((t - today) / 86_400_000) }
  }
  return null
}

/** Ticker/dashboard tile for the current deposit rate. */
export function ecbRateTile(r: EcbRates): MarketData {
  const last = r.changes[r.changes.length - 1]
  return {
    name: 'ECB Rate',
    ticker: '',
    value: `${r.current.toFixed(2)}%`,
    change: formatEcbDate(r.since, { year: false }),
    changePct: last ? `${last.changeBp > 0 ? '▲' : '▼'} ${formatBp(last.changeBp)} · ${formatEcbDate(r.since, { year: false })}` : 'Unchanged',
    direction: last ? (last.changeBp > 0 ? 'up' : 'down') : 'flat',
  }
}
