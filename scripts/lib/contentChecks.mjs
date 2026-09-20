/**
 * Publish-time checks for AI-written content (daily brief, flash items).
 * Pure functions: no I/O, so they are unit-tested (tests/contentChecks.test.ts).
 *
 * Each check returns { errors, warnings }.
 *  - errors   block publication (near-zero false-positive rules only)
 *  - warnings are logged as workflow annotations; promote to errors once real runs show they are reliable
 */

const MINUS = /[−–]/g // typographic minus and en dash -> ASCII hyphen

// Advisory or promissory wording that MiFID II general-information content must avoid.
export const BANNED_PHRASES = [
  /\byou should (buy|sell|invest|hold|avoid)\b/i,
  /\bwe (recommend|advise)\b/i,
  /\b(buy|sell) (now|today|immediately)\b/i,
  /\bguaranteed?\b/i,
  /\bprice target\b/i,
  /\bcan'?t lose\b/i,
]

// Text that means a value failed to format or a placeholder leaked.
const BROKEN_PATTERNS = [/\bundefined\b/, /\bNaN\b/, /\[object [A-Za-z]+\]/, /[€$£]null\b|\bnull%/]

export function findBannedPhrases(text) {
  return BANNED_PHRASES.filter(re => re.test(text)).map(re => String(re.exec(text)?.[0] ?? re))
}

export function findBrokenText(text) {
  return BROKEN_PATTERNS.filter(re => re.test(text)).map(re => String(re.exec(text)?.[0] ?? re))
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/** true if a label such as "Friday, 18 September 2026" or "Fri 18 Sep" names the weekday of isoDate (YYYY-MM-DD). */
export function weekdayMatches(label, isoDate) {
  const day = WEEKDAYS[new Date(`${isoDate}T12:00:00Z`).getUTCDay()]
  if (!day) return false
  const m = label.match(/\b(Sun|Mon|Tue|Wed|Thu|Fri|Sat)[a-z]*\b/i)
  if (!m) return true // no weekday named: nothing to contradict
  return day.toLowerCase().startsWith(m[1].toLowerCase())
}

/** Percentages, basis points and currency amounts found in text, as absolute numbers. */
export function extractFigures(text) {
  const clean = text.replace(MINUS, '-').replace(/(\d),(?=\d{3}\b)/g, '$1')
  const num = s => Math.abs(parseFloat(s))
  const percents = [...clean.matchAll(/(-?\+?\d+(?:\.\d+)?)\s?%/g)].map(m => num(m[1]))
  const bps = [...clean.matchAll(/(\d+(?:\.\d+)?)\s?bps?\b/gi)].map(m => num(m[1]))
  const money = [...clean.matchAll(/([€$£])\s?(\d+(?:\.\d+)?)/g)].map(m => ({ symbol: m[1], value: num(m[2]) }))
  return { percents, bps, money }
}

/**
 * Figures in `text` that do not appear in `sourceText` (the data the model was given).
 * Percentages match within `pctTolerance` points (rounding), money within 1% (round thresholds such as "below $100" are normal), bp exactly.
 */
export function unsupportedFigures(text, sourceText, { pctTolerance = 0.06 } = {}) {
  const got = extractFigures(text)
  const src = extractFigures(sourceText)
  const out = []
  for (const p of got.percents) {
    if (!src.percents.some(s => Math.abs(s - p) <= pctTolerance)) out.push(`${p}%`)
  }
  for (const b of got.bps) {
    if (!src.bps.some(s => s === b)) out.push(`${b}bp`)
  }
  for (const m of got.money) {
    if (!src.money.some(s => s.symbol === m.symbol && Math.abs(s.value - m.value) <= Math.max(0.01 * s.value, 0.005))) {
      out.push(`${m.symbol}${m.value}`)
    }
  }
  return out
}

/**
 * Daily brief gate.
 * @param {{headline:string, excerpt:string, dateLabel:string, isoDate:string,
 *          sections:Record<string,string>, inputText:string}} b
 */
export function checkBrief(b) {
  const errors = []
  const warnings = []
  const all = [b.headline, b.excerpt, ...Object.values(b.sections)].join('\n')

  if (!b.headline || b.headline.length < 15) errors.push('headline is missing or too short')
  if (b.headline && b.headline.length > 90) errors.push(`headline is ${b.headline.length} characters (max 90)`)
  for (const [name, text] of Object.entries(b.sections)) {
    if (!text || text.trim().length < 30) errors.push(`section "${name}" is empty or too short`)
  }
  const broken = findBrokenText(all)
  if (broken.length) errors.push(`broken text in output: ${broken.join(', ')}`)
  const banned = findBannedPhrases(all)
  if (banned.length) errors.push(`advisory or promissory wording: ${banned.join(', ')}`)
  if (!weekdayMatches(b.dateLabel, b.isoDate)) errors.push(`date label "${b.dateLabel}" does not match ${b.isoDate}`)

  const unsupported = unsupportedFigures(all, b.inputText)
  if (unsupported.length) warnings.push(`figures not found in the market data given to the model: ${[...new Set(unsupported)].join(', ')}`)

  return { errors, warnings }
}

/**
 * Flash item gate. The model only sees a news headline, so any percentage, basis-point
 * or currency figure that is not in that headline was invented and blocks publication.
 * @param {{headline:string, excerpt:string, body:string, sourceText:string, now?:Date}} f
 */
export function checkFlash(f) {
  const errors = []
  const warnings = []
  const all = [f.headline, f.excerpt, f.body].join('\n')

  if (!f.headline || !f.body || f.body.trim().length < 80) errors.push('headline or body is missing or too short')
  const broken = findBrokenText(all)
  if (broken.length) errors.push(`broken text in output: ${broken.join(', ')}`)
  const banned = findBannedPhrases(all)
  if (banned.length) errors.push(`advisory or promissory wording: ${banned.join(', ')}`)

  const invented = unsupportedFigures(f.body, f.sourceText)
  if (invented.length) errors.push(`figures not in the source headline: ${[...new Set(invented)].join(', ')}`)

  const year = (f.now ?? new Date()).getUTCFullYear()
  const oldYears = [...all.matchAll(/\b(20\d{2})\b/g)].map(m => Number(m[1])).filter(y => y < year - 1)
  if (oldYears.length) warnings.push(`mentions old year(s): ${[...new Set(oldYears)].join(', ')}`)

  return { errors, warnings }
}
