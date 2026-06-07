/**
 * One-shot hotfix: recalculate changePct from existing OHLCV data.
 * Uses the last two daily closes in data/stocks/*.json — no API calls.
 * Run: node scripts/fix-changepct.mjs
 */
import { readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT         = join(dirname(fileURLToPath(import.meta.url)), '..')
const SCREENER     = join(ROOT, 'data', 'screener.json')
const STOCKS_DIR   = join(ROOT, 'data', 'stocks')

const screener = JSON.parse(await readFile(SCREENER, 'utf8'))
const all = [...(screener.stocks ?? []), ...(screener.etfs ?? [])]

let fixed = 0, skipped = 0

for (const item of all) {
  const safe = item.ticker.replace(/[^a-zA-Z0-9._-]/g, '_')
  try {
    const ohlcv = JSON.parse(await readFile(join(STOCKS_DIR, `${safe}.json`), 'utf8'))
    const n = ohlcv.length
    if (n >= 2) {
      const prev = ohlcv[n - 2].close
      const curr = ohlcv[n - 1].close
      if (prev && prev !== 0 && curr) {
        const change    = parseFloat((curr - prev).toFixed(2))
        const changePct = parseFloat(((change / prev) * 100).toFixed(2))
        item.price      = curr
        item.change     = change
        item.changePct  = changePct
        fixed++
        process.stdout.write(`  ✓ ${item.ticker.padEnd(16)} ${changePct >= 0 ? '+' : ''}${changePct}%\n`)
      } else {
        skipped++
      }
    } else {
      skipped++
    }
  } catch {
    skipped++
  }
}

await writeFile(SCREENER, JSON.stringify(screener, null, 2), 'utf8')
console.log(`\nDone: fixed ${fixed}, skipped ${skipped} of ${all.length} instruments`)
