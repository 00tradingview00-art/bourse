import type { MarketData, Brief, Exchange, Feature } from '@/types'

export const TICKER_ITEMS: MarketData[] = [
  // European indices
  { name: 'AEX',           ticker: '^AEX',       value: '1,037.1',  change: '-6.9',    changePct: '-0.66%', direction: 'down' },
  { name: 'DAX',           ticker: '^GDAXI',     value: '24,934.9', change: '+138.9',  changePct: '+0.56%', direction: 'up' },
  { name: 'CAC 40',        ticker: '^FCHI',      value: '8,226.4',  change: '+76.0',   changePct: '+0.93%', direction: 'up' },
  { name: 'FTSE 100',      ticker: '^FTSE',      value: '10,274.7', change: '-57.6',   changePct: '-0.56%', direction: 'down' },
  { name: 'IBEX 35',       ticker: '^IBEX',      value: '18,279.3', change: '+103.3',  changePct: '+0.57%', direction: 'up' },
  { name: 'FTSE MIB',      ticker: 'FTSEMIB.MI', value: '49,893',   change: '-146',    changePct: '-0.29%', direction: 'down' },
  { name: 'Euro Stoxx 50', ticker: '^SX5E',      value: '5,318.2',  change: '+22.4',   changePct: '+0.42%', direction: 'up' },
  // Global
  { name: 'S&P 500',       ticker: '^GSPC',      value: '5,842.0',  change: '+18.3',   changePct: '+0.31%', direction: 'up' },
  { name: 'Nasdaq 100',    ticker: '^NDX',       value: '21,134.5', change: '+94.2',   changePct: '+0.45%', direction: 'up' },
  // Amsterdam stocks
  { name: 'ASML',          ticker: 'ASML.AS',    value: '€1,454.8', change: '-30.4',   changePct: '-2.05%', direction: 'down' },
  { name: 'Adyen',         ticker: 'ADYEN.AS',   value: '€860',     change: '+11.8',   changePct: '+1.39%', direction: 'up' },
  { name: 'Shell',         ticker: 'SHELL.AS',   value: '€37.31',   change: '-0.52',   changePct: '-1.37%', direction: 'down' },
  // Commodities
  { name: 'Brent',         ticker: 'BZ=F',       value: '$95.38',   change: '-2.34',   changePct: '-2.48%', direction: 'down' },
  { name: 'WTI',           ticker: 'CL=F',       value: '$91.20',   change: '-1.98',   changePct: '-2.13%', direction: 'down' },
  { name: 'Nat Gas',       ticker: 'NG=F',       value: '$2.847',   change: '+0.031',  changePct: '+1.10%', direction: 'up' },
  { name: 'Gold',          ticker: 'GC=F',       value: '$3,318',   change: '+12.4',   changePct: '+0.37%', direction: 'up' },
  { name: 'Silver',        ticker: 'SI=F',       value: '$32.84',   change: '-0.21',   changePct: '-0.64%', direction: 'down' },
  { name: 'Copper',        ticker: 'HG=F',       value: '$4.641',   change: '+0.047',  changePct: '+1.02%', direction: 'up' },
  // FX
  { name: 'EUR/USD',       ticker: 'EURUSD',     value: '1.1641',   change: '—',       changePct: '—',      direction: 'flat' },
  { name: 'EUR/GBP',       ticker: 'EURGBP',     value: '0.8412',   change: '—',       changePct: '—',      direction: 'flat' },
  { name: 'EUR/INR',       ticker: 'EURINR',     value: '₹111.40',  change: '—',       changePct: '—',      direction: 'flat' },
  // Rates
  { name: 'ECB Rate',      ticker: '',           value: '2.00%',    change: 'Jun 11',  changePct: '▲ +25bp', direction: 'up' },
]

export const DASHBOARD_MARKETS: MarketData[] = [
  { name: 'AEX', ticker: '^AEX', value: '1,034.9', change: '+8.1', changePct: '+0.79%', direction: 'up', country: 'NL', flag: '🇳🇱' },
  { name: 'DAX', ticker: '^GDAXI', value: '22,491', change: '+70.3', changePct: '+0.31%', direction: 'up', country: 'DE', flag: '🇩🇪' },
  { name: 'CAC 40', ticker: '^FCHI', value: '7,812', change: '+41.8', changePct: '+0.54%', direction: 'up', country: 'FR', flag: '🇫🇷' },
  { name: 'FTSE 100', ticker: '^FTSE', value: '8,743', change: '-15.7', changePct: '-0.18%', direction: 'down', country: 'UK', flag: '🇬🇧' },
  { name: 'IBEX 35', ticker: '^IBEX', value: '13,214', change: '+93.2', changePct: '+0.71%', direction: 'up', country: 'ES', flag: '🇪🇸' },
  { name: 'FTSE MIB', ticker: 'FTSEMIB.MI', value: '37,882', change: '-124', changePct: '-0.33%', direction: 'down', country: 'IT', flag: '🇮🇹' },
]

export const BRIEFS: Brief[] = [
  {
    edition: 29,
    date: 'Monday, 2 June 2026',
    dateShort: 'Mon 2 Jun 2026',
    headline: 'Oil Near $104, Eurozone Equities Hold Gains Ahead of June ECB Decision',
    excerpt: 'Middle East supply risk lifts Brent to $104 as the Iran-Hormuz premium reasserts itself. AEX outperforms on ASML strength. Markets digest a near-certain ECB rate hike on June 11 — the first in 14 months — without panic, pricing a growth-resilient hiking cycle rather than a policy error.',
    tags: [
      { label: 'AEX', variant: 'green' },
      { label: 'Energy', variant: 'red' },
      { label: 'ECB Watch', variant: 'gold' },
      { label: 'Macro', variant: 'default' },
    ],
    readTime: 4,
    slug: 'edition-029',
  },
  {
    edition: 28,
    date: 'Friday, 29 May 2026',
    dateShort: 'Fri 29 May 2026',
    headline: 'Post-Fed Relief: Euro Holds 1.17 as Rate Anxiety Clears',
    excerpt: 'Fed uncertainty that paralysed markets through May has resolved into a directional relief trade, lifting gold while crude and copper stay under pressure. EUR/USD stabilises above 1.167.',
    tags: [
      { label: 'EUR/USD', variant: 'green' },
      { label: 'Fed', variant: 'gold' },
      { label: 'CAC 40', variant: 'default' },
    ],
    readTime: 4,
    slug: 'edition-028',
  },
  {
    edition: 27,
    date: 'Thursday, 28 May 2026',
    dateShort: 'Thu 28 May 2026',
    headline: 'Venezuela Shock Reverses — European Equities Recover on Risk Appetite',
    excerpt: 'As geopolitical supply-shock panic recedes, a coordinated risk-recovery bid is lifting European equities while crude drifts sideways. DAX leads the bounce.',
    tags: [
      { label: 'Energy', variant: 'red' },
      { label: 'DAX', variant: 'default' },
      { label: 'Commodities', variant: 'gold' },
    ],
    readTime: 3,
    slug: 'edition-027',
  },
  {
    edition: 26,
    date: 'Wednesday, 27 May 2026',
    dateShort: 'Wed 27 May 2026',
    headline: 'Adyen Q1 Beat Supports Payments Sector; ASML Buyback Confirmed',
    excerpt: 'Adyen reported Q1 revenue marginally ahead of forecasts, maintaining 20–22% full-year growth guidance. ASML confirmed €79.4M in buybacks under 2026 programme.',
    tags: [
      { label: 'AEX', variant: 'green' },
      { label: 'Earnings', variant: 'default' },
      { label: 'Tech', variant: 'default' },
    ],
    readTime: 5,
    slug: 'edition-026',
  },
  {
    edition: 25,
    date: 'Tuesday, 26 May 2026',
    dateShort: 'Tue 26 May 2026',
    headline: 'Dollar Weakness Lifts Euro Exporters; ECB June Meeting in Focus',
    excerpt: 'A weakening dollar and fading rate-fear are driving a unified European equity rally. EUR/USD holds above 1.165. All eyes turn to ECB June 11 where a 25bp hike is now 90% priced.',
    tags: [
      { label: 'EUR/USD', variant: 'green' },
      { label: 'ECB', variant: 'gold' },
      { label: 'Macro', variant: 'default' },
    ],
    readTime: 4,
    slug: 'edition-025',
  },
]

export const EXCHANGES: Exchange[] = [
  { flag: '🇳🇱', name: 'Euronext Amsterdam', index: 'AEX · AMX · AScX', country: 'Netherlands' },
  { flag: '🇩🇪', name: 'Xetra / Frankfurt', index: 'DAX 40 · MDAX', country: 'Germany' },
  { flag: '🇫🇷', name: 'Euronext Paris', index: 'CAC 40 · SBF 120', country: 'France' },
  { flag: '🇬🇧', name: 'London Stock Exchange', index: 'FTSE 100 · AIM', country: 'United Kingdom' },
  { flag: '🇮🇹', name: 'Euronext Milan', index: 'FTSE MIB', country: 'Italy' },
  { flag: '🇸🇪', name: 'Nasdaq Nordic', index: 'Stockholm · Helsinki', country: 'Sweden / Finland' },
]

export const FEATURES: Feature[] = [
  {
    num: '01',
    icon: '📰',
    title: 'The Daily Brief',
    description: 'Every weekday at 6:30 AM CET — a precise, context-rich briefing on what moved European markets overnight and what to watch today. No noise. No filler. Every brief in under 5 minutes.',
  },
  {
    num: '02',
    icon: '🔍',
    title: 'European Screener',
    description: 'Filter AEX, AMX, DAX, CAC and FTSE stocks by RSI, MACD, SuperTrend, volume signals and earnings proximity. Built natively for Euronext tickers — not a global tool retrofitted for Europe.',
  },
  {
    num: '03',
    icon: '🌍',
    title: 'Macro–Equity Bridge',
    description: 'Crude up → Shell and TotalEnergies implications. ECB hike → ING and ABN AMRO read-through. Gas prices → ArcelorMittal margin impact. We connect the macro tape to your European holdings.',
  },
  {
    num: '04',
    icon: '🏦',
    title: 'ECB & Rate Watch',
    description: 'Dedicated ECB decision calendar, rate path probabilities, and post-meeting analysis. European monetary policy explained clearly — without a Bloomberg Terminal.',
  },
  {
    num: '05',
    icon: '📊',
    title: 'Expat Investor Layer',
    description: 'Box 3 aware portfolio context, 30% ruling tax implications, UCITS ETF intelligence, and dividend withholding analysis. Investing in Europe is complex — Boursee makes it clear.',
  },
  {
    num: '06',
    icon: '📈',
    title: 'Independent Research',
    description: 'Every brief, stock summary and sector analysis is produced from primary data sources — not opinion or paid content. Fresh, consistent, and free from conflicts of interest.',
  },
]
