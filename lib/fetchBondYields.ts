export interface BondYield {
  country: string
  code: string
  flag: string
  label: string
  instrument: string
  yield: number | null
  change: number | null
  date: string | null
  isLive: boolean
}

// Fallback values — approximate, updated periodically
const FALLBACKS: Omit<BondYield, 'isLive'>[] = [
  { country: 'Germany',  code: 'DE', flag: '🇩🇪', label: 'Bund 10Y',  instrument: 'German Bund',       yield: 2.52, change: null, date: null },
  { country: 'France',   code: 'FR', flag: '🇫🇷', label: 'OAT 10Y',   instrument: 'French OAT',        yield: 3.21, change: null, date: null },
  { country: 'Italy',    code: 'IT', flag: '🇮🇹', label: 'BTP 10Y',   instrument: 'Italian BTP',       yield: 3.78, change: null, date: null },
  { country: 'Spain',    code: 'ES', flag: '🇪🇸', label: 'Bono 10Y',  instrument: 'Spanish Bono',      yield: 3.18, change: null, date: null },
  { country: 'UK',       code: 'GB', flag: '🇬🇧', label: 'Gilt 10Y',  instrument: 'UK Gilt',           yield: 4.41, change: null, date: null },
]

// ECB SDW API — monthly Maastricht criterion long-term rates, CSV format
async function fetchEcbYields(): Promise<Partial<Record<string, { yield: number; date: string }>>> {
  try {
    const url = 'https://data-api.ecb.europa.eu/service/data/IRS/M.DE+ES+FR+IT.L.L40.CI.0.EUR.N.Z?format=csvdata&lastNObservations=2'
    const res = await fetch(url, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) })
    if (!res.ok) return {}
    const text = await res.text()
    const lines = text.trim().split('\n').filter(l => !l.startsWith('KEY,') && l.trim())
    const result: Partial<Record<string, { yield: number; date: string }>> = {}
    for (const line of lines) {
      const parts = line.split(',')
      // CSV columns: KEY,FREQ,REF_AREA,IR_TYPE,IR_BUS,IR_ITEM,DATA_TYPE,CURRENCY,BS_COUNT_SECTOR,VIS_CT_SECTOR,TIME_PERIOD,OBS_VALUE,...
      const country = parts[2]?.trim()
      const date = parts[10]?.trim()
      const value = parseFloat(parts[11]?.trim() ?? '')
      if (country && date && !isNaN(value)) {
        // Take the latest observation (last line per country wins since sorted ascending)
        result[country] = { yield: value, date }
      }
    }
    return result
  } catch {
    return {}
  }
}

export async function fetchBondYields(): Promise<BondYield[]> {
  const ecb = await fetchEcbYields()
  const isLiveAvailable = Object.keys(ecb).length > 0

  return FALLBACKS.map(fb => {
    const live = ecb[fb.code]
    if (live) {
      return { ...fb, yield: live.yield, date: live.date, isLive: true }
    }
    return { ...fb, isLive: false }
  })
}
