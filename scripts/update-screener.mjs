/**
 * update-screener.mjs
 * Fetches 3 months of daily OHLCV from Yahoo Finance for ~172 European stocks + 15 ETFs,
 * computes RSI(14), MACD(12,26,9), SuperTrend(10,3), and volume signal,
 * then writes data/screener.json.
 *
 * Run: node scripts/update-screener.mjs
 * No API key required. Runs after European market close (18:30 UTC weekdays).
 */

import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT       = join(__dirname, '..')
const OUTPUT     = join(ROOT, 'data', 'screener.json')

// ── Stock universe ────────────────────────────────────────────────
const STOCKS = [
  // AEX — Euronext Amsterdam (all 25 constituents)
  { ticker: 'ABN.AS',   name: 'ABN AMRO',          exchange: 'AEX', sector: 'Financials' },
  { ticker: 'AD.AS',    name: 'Ahold Delhaize',     exchange: 'AEX', sector: 'Consumer' },
  { ticker: 'ADYEN.AS', name: 'Adyen',              exchange: 'AEX', sector: 'Financials' },
  { ticker: 'AGN.AS',   name: 'Aegon',              exchange: 'AEX', sector: 'Financials' },
  { ticker: 'AKZA.AS',  name: 'Akzo Nobel',         exchange: 'AEX', sector: 'Materials' },
  { ticker: 'ASM.AS',   name: 'ASM International',  exchange: 'AEX', sector: 'Technology' },
  { ticker: 'ASML.AS',  name: 'ASML',               exchange: 'AEX', sector: 'Technology' },
  { ticker: 'ASRNL.AS', name: 'ASR Nederland',      exchange: 'AEX', sector: 'Financials' },
  { ticker: 'BESI.AS',  name: 'BE Semiconductor',   exchange: 'AEX', sector: 'Technology' },
  { ticker: 'DSFIR.AS', name: 'DSM-Firmenich',      exchange: 'AEX', sector: 'Materials' },
  { ticker: 'EXO.AS',   name: 'Exor',               exchange: 'AEX', sector: 'Financials' },
  { ticker: 'HEIA.AS',  name: 'Heineken',            exchange: 'AEX', sector: 'Consumer' },
  { ticker: 'IMCD.AS',  name: 'IMCD',               exchange: 'AEX', sector: 'Industrials' },
  { ticker: 'INGA.AS',  name: 'ING',                exchange: 'AEX', sector: 'Financials' },
  { ticker: 'KPN.AS',   name: 'KPN',                exchange: 'AEX', sector: 'Telecoms' },
  { ticker: 'MT.AS',    name: 'ArcelorMittal',       exchange: 'AEX', sector: 'Materials' },
  { ticker: 'NN.AS',    name: 'NN Group',            exchange: 'AEX', sector: 'Financials' },
  { ticker: 'PHIA.AS',  name: 'Philips',             exchange: 'AEX', sector: 'Healthcare' },
  { ticker: 'PRX.AS',   name: 'Prosus',              exchange: 'AEX', sector: 'Technology' },
  { ticker: 'RAND.AS',  name: 'Randstad',            exchange: 'AEX', sector: 'Industrials' },
  { ticker: 'REN.AS',   name: 'RELX (NL)',           exchange: 'AEX', sector: 'Technology' },
  { ticker: 'SHELL.AS', name: 'Shell',               exchange: 'AEX', sector: 'Energy' },
  { ticker: 'STLAM.AS', name: 'Stellantis',          exchange: 'AEX', sector: 'Autos' },
  { ticker: 'UMG.AS',   name: 'Universal Music',     exchange: 'AEX', sector: 'Consumer' },
  { ticker: 'WKL.AS',   name: 'Wolters Kluwer',      exchange: 'AEX', sector: 'Technology' },

  // DAX — Xetra Frankfurt (full 40)
  { ticker: 'ADS.DE',   name: 'Adidas',              exchange: 'DAX', sector: 'Consumer' },
  { ticker: 'ALV.DE',   name: 'Allianz',             exchange: 'DAX', sector: 'Financials' },
  { ticker: 'BAS.DE',   name: 'BASF',                exchange: 'DAX', sector: 'Materials' },
  { ticker: 'BAYN.DE',  name: 'Bayer',               exchange: 'DAX', sector: 'Healthcare' },
  { ticker: 'BEI.DE',   name: 'Beiersdorf',          exchange: 'DAX', sector: 'Consumer' },
  { ticker: 'BMW.DE',   name: 'BMW',                 exchange: 'DAX', sector: 'Autos' },
  { ticker: 'BNR.DE',   name: 'Brenntag',            exchange: 'DAX', sector: 'Materials' },
  { ticker: 'CBK.DE',   name: 'Commerzbank',         exchange: 'DAX', sector: 'Financials' },
  { ticker: 'CON.DE',   name: 'Continental',         exchange: 'DAX', sector: 'Autos' },
  { ticker: '1COV.DE',  name: 'Covestro',            exchange: 'DAX', sector: 'Materials' },
  { ticker: 'DB1.DE',   name: 'Deutsche Boerse',     exchange: 'DAX', sector: 'Financials' },
  { ticker: 'DBK.DE',   name: 'Deutsche Bank',       exchange: 'DAX', sector: 'Financials' },
  { ticker: 'DHL.DE',   name: 'DHL Group',           exchange: 'DAX', sector: 'Industrials' },
  { ticker: 'DTE.DE',   name: 'Deutsche Telekom',    exchange: 'DAX', sector: 'Telecoms' },
  { ticker: 'DTG.DE',   name: 'Daimler Truck',       exchange: 'DAX', sector: 'Autos' },
  { ticker: 'EOAN.DE',  name: 'E.ON',                exchange: 'DAX', sector: 'Utilities' },
  { ticker: 'ENR.DE',   name: 'Siemens Energy',      exchange: 'DAX', sector: 'Energy' },
  { ticker: 'FRE.DE',   name: 'Fresenius',           exchange: 'DAX', sector: 'Healthcare' },
  { ticker: 'G1A.DE',   name: 'GEA Group',           exchange: 'DAX', sector: 'Industrials' },
  { ticker: 'G24.DE',   name: 'Scout24',             exchange: 'DAX', sector: 'Technology' },
  { ticker: 'HEI.DE',   name: 'Heidelberg Materials',exchange: 'DAX', sector: 'Materials' },
  { ticker: 'HEN3.DE',  name: 'Henkel',              exchange: 'DAX', sector: 'Consumer' },
  { ticker: 'HNR1.DE',  name: 'Hannover Re',         exchange: 'DAX', sector: 'Financials' },
  { ticker: 'IFX.DE',   name: 'Infineon',            exchange: 'DAX', sector: 'Technology' },
  { ticker: 'LIN.DE',   name: 'Linde',               exchange: 'DAX', sector: 'Materials' },
  { ticker: 'MBG.DE',   name: 'Mercedes-Benz',       exchange: 'DAX', sector: 'Autos' },
  { ticker: 'MRK.DE',   name: 'Merck KGaA',          exchange: 'DAX', sector: 'Healthcare' },
  { ticker: 'MTX.DE',   name: 'MTU Aero Engines',    exchange: 'DAX', sector: 'Industrials' },
  { ticker: 'MUV2.DE',  name: 'Munich Re',           exchange: 'DAX', sector: 'Financials' },
  { ticker: 'PAH3.DE',  name: 'Porsche SE',          exchange: 'DAX', sector: 'Autos' },
  { ticker: 'QIA.DE',   name: 'QIAGEN',              exchange: 'DAX', sector: 'Healthcare' },
  { ticker: 'RHM.DE',   name: 'Rheinmetall',         exchange: 'DAX', sector: 'Defence' },
  { ticker: 'RWE.DE',   name: 'RWE',                 exchange: 'DAX', sector: 'Utilities' },
  { ticker: 'SAP.DE',   name: 'SAP',                 exchange: 'DAX', sector: 'Technology' },
  { ticker: 'SHL.DE',   name: 'Siemens Healthineers',exchange: 'DAX', sector: 'Healthcare' },
  { ticker: 'SIE.DE',   name: 'Siemens',             exchange: 'DAX', sector: 'Industrials' },
  { ticker: 'SY1.DE',   name: 'Symrise',             exchange: 'DAX', sector: 'Materials' },
  { ticker: 'VNA.DE',   name: 'Vonovia',             exchange: 'DAX', sector: 'Real Estate' },
  { ticker: 'VOW3.DE',  name: 'Volkswagen',          exchange: 'DAX', sector: 'Autos' },
  { ticker: 'ZAL.DE',   name: 'Zalando',             exchange: 'DAX', sector: 'Consumer' },

  // CAC 40 — Euronext Paris (full 40)
  { ticker: 'AC.PA',    name: 'Accor',               exchange: 'CAC', sector: 'Consumer' },
  { ticker: 'AI.PA',    name: 'Air Liquide',         exchange: 'CAC', sector: 'Materials' },
  { ticker: 'AIR.PA',   name: 'Airbus',              exchange: 'CAC', sector: 'Industrials' },
  { ticker: 'ACA.PA',   name: 'Credit Agricole',     exchange: 'CAC', sector: 'Financials' },
  { ticker: 'BNP.PA',   name: 'BNP Paribas',        exchange: 'CAC', sector: 'Financials' },
  { ticker: 'BN.PA',    name: 'Danone',              exchange: 'CAC', sector: 'Consumer' },
  { ticker: 'CAP.PA',   name: 'Capgemini',           exchange: 'CAC', sector: 'Technology' },
  { ticker: 'CA.PA',    name: 'Carrefour',           exchange: 'CAC', sector: 'Consumer' },
  { ticker: 'CS.PA',    name: 'AXA',                 exchange: 'CAC', sector: 'Financials' },
  { ticker: 'DSY.PA',   name: 'Dassault Systemes',  exchange: 'CAC', sector: 'Technology' },
  { ticker: 'EDEN.PA',  name: 'Edenred',             exchange: 'CAC', sector: 'Financials' },
  { ticker: 'EL.PA',    name: 'EssilorLuxottica',   exchange: 'CAC', sector: 'Healthcare' },
  { ticker: 'ENGI.PA',  name: 'Engie',               exchange: 'CAC', sector: 'Utilities' },
  { ticker: 'ERF.PA',   name: 'Eurofins',            exchange: 'CAC', sector: 'Healthcare' },
  { ticker: 'GLE.PA',   name: 'Societe Generale',    exchange: 'CAC', sector: 'Financials' },
  { ticker: 'KER.PA',   name: 'Kering',              exchange: 'CAC', sector: 'Consumer' },
  { ticker: 'LR.PA',    name: 'Legrand',             exchange: 'CAC', sector: 'Industrials' },
  { ticker: 'MC.PA',    name: 'LVMH',                exchange: 'CAC', sector: 'Consumer' },
  { ticker: 'ML.PA',    name: 'Michelin',            exchange: 'CAC', sector: 'Autos' },
  { ticker: 'ORA.PA',   name: 'Orange',              exchange: 'CAC', sector: 'Telecoms' },
  { ticker: 'OR.PA',    name: "L'Oreal",             exchange: 'CAC', sector: 'Consumer' },
  { ticker: 'PUB.PA',   name: 'Publicis',            exchange: 'CAC', sector: 'Consumer' },
  { ticker: 'RI.PA',    name: 'Pernod Ricard',       exchange: 'CAC', sector: 'Consumer' },
  { ticker: 'RMS.PA',   name: 'Hermes',              exchange: 'CAC', sector: 'Consumer' },
  { ticker: 'RNO.PA',   name: 'Renault',             exchange: 'CAC', sector: 'Autos' },
  { ticker: 'SAF.PA',   name: 'Safran',              exchange: 'CAC', sector: 'Industrials' },
  { ticker: 'SAN.PA',   name: 'Sanofi',              exchange: 'CAC', sector: 'Healthcare' },
  { ticker: 'SGO.PA',   name: 'Saint-Gobain',        exchange: 'CAC', sector: 'Materials' },
  { ticker: 'STLAP.PA', name: 'Stellantis (PA)',     exchange: 'CAC', sector: 'Autos' },
  { ticker: 'STMPA.PA', name: 'STMicro',             exchange: 'CAC', sector: 'Technology' },
  { ticker: 'SU.PA',    name: 'Schneider Electric',  exchange: 'CAC', sector: 'Industrials' },
  { ticker: 'TEP.PA',   name: 'Teleperformance',     exchange: 'CAC', sector: 'Technology' },
  { ticker: 'HO.PA',    name: 'Thales',              exchange: 'CAC', sector: 'Defence' },
  { ticker: 'TTE.PA',   name: 'TotalEnergies',       exchange: 'CAC', sector: 'Energy' },
  { ticker: 'URW.PA',   name: 'Unibail-Rodamco',     exchange: 'CAC', sector: 'Real Estate' },
  { ticker: 'VIE.PA',   name: 'Veolia',              exchange: 'CAC', sector: 'Utilities' },
  { ticker: 'DG.PA',    name: 'Vinci',               exchange: 'CAC', sector: 'Industrials' },

  // FTSE 100 — London Stock Exchange (top 30 by market cap)
  { ticker: 'AZN.L',    name: 'AstraZeneca',         exchange: 'FTSE', sector: 'Healthcare' },
  { ticker: 'HSBA.L',   name: 'HSBC',                exchange: 'FTSE', sector: 'Financials' },
  { ticker: 'SHEL.L',   name: 'Shell',               exchange: 'FTSE', sector: 'Energy' },
  { ticker: 'ULVR.L',   name: 'Unilever',            exchange: 'FTSE', sector: 'Consumer' },
  { ticker: 'REL.L',    name: 'RELX',                exchange: 'FTSE', sector: 'Technology' },
  { ticker: 'BP.L',     name: 'BP',                  exchange: 'FTSE', sector: 'Energy' },
  { ticker: 'GSK.L',    name: 'GSK',                 exchange: 'FTSE', sector: 'Healthcare' },
  { ticker: 'RIO.L',    name: 'Rio Tinto',           exchange: 'FTSE', sector: 'Materials' },
  { ticker: 'BA.L',     name: 'BAE Systems',         exchange: 'FTSE', sector: 'Defence' },
  { ticker: 'BARC.L',   name: 'Barclays',            exchange: 'FTSE', sector: 'Financials' },
  { ticker: 'LLOY.L',   name: 'Lloyds',              exchange: 'FTSE', sector: 'Financials' },
  { ticker: 'NG.L',     name: 'National Grid',       exchange: 'FTSE', sector: 'Utilities' },
  { ticker: 'DGE.L',    name: 'Diageo',              exchange: 'FTSE', sector: 'Consumer' },
  { ticker: 'RKT.L',    name: 'Reckitt',             exchange: 'FTSE', sector: 'Consumer' },
  { ticker: 'VOD.L',    name: 'Vodafone',            exchange: 'FTSE', sector: 'Telecoms' },
  { ticker: 'STAN.L',   name: 'Standard Chartered',  exchange: 'FTSE', sector: 'Financials' },
  { ticker: 'HLN.L',    name: 'Haleon',              exchange: 'FTSE', sector: 'Healthcare' },
  { ticker: 'CPG.L',    name: 'Compass Group',       exchange: 'FTSE', sector: 'Consumer' },
  { ticker: 'SSE.L',    name: 'SSE',                 exchange: 'FTSE', sector: 'Utilities' },
  { ticker: 'LGEN.L',   name: 'Legal & General',     exchange: 'FTSE', sector: 'Financials' },
  { ticker: 'WPP.L',    name: 'WPP',                 exchange: 'FTSE', sector: 'Consumer' },
  { ticker: 'FRES.L',   name: 'Fresnillo',           exchange: 'FTSE', sector: 'Materials' },
  { ticker: 'PRU.L',    name: 'Prudential',          exchange: 'FTSE', sector: 'Financials' },
  { ticker: 'IHG.L',    name: 'IHG Hotels',          exchange: 'FTSE', sector: 'Consumer' },
  { ticker: 'BT.L',     name: 'BT Group',            exchange: 'FTSE', sector: 'Telecoms' },
  { ticker: 'MKS.L',    name: 'Marks & Spencer',     exchange: 'FTSE', sector: 'Consumer' },
  { ticker: 'EXPN.L',   name: 'Experian',            exchange: 'FTSE', sector: 'Technology' },
  { ticker: 'RMV.L',    name: 'Rightmove',           exchange: 'FTSE', sector: 'Technology' },
  { ticker: 'PSON.L',   name: 'Pearson',             exchange: 'FTSE', sector: 'Consumer' },
  { ticker: 'AUTO.L',   name: 'Auto Trader',         exchange: 'FTSE', sector: 'Technology' },

  // IBEX 35 — Bolsa de Madrid (top 20 by market cap)
  { ticker: 'ITX.MC',   name: 'Inditex',             exchange: 'IBEX', sector: 'Consumer' },
  { ticker: 'SAN.MC',   name: 'Banco Santander',     exchange: 'IBEX', sector: 'Financials' },
  { ticker: 'BBVA.MC',  name: 'BBVA',                exchange: 'IBEX', sector: 'Financials' },
  { ticker: 'IBE.MC',   name: 'Iberdrola',           exchange: 'IBEX', sector: 'Utilities' },
  { ticker: 'REP.MC',   name: 'Repsol',              exchange: 'IBEX', sector: 'Energy' },
  { ticker: 'NTGY.MC',  name: 'Naturgy',             exchange: 'IBEX', sector: 'Utilities' },
  { ticker: 'TEF.MC',   name: 'Telefonica',          exchange: 'IBEX', sector: 'Telecoms' },
  { ticker: 'ANA.MC',   name: 'Acciona',             exchange: 'IBEX', sector: 'Utilities' },
  { ticker: 'MAP.MC',   name: 'Mapfre',              exchange: 'IBEX', sector: 'Financials' },
  { ticker: 'CABK.MC',  name: 'CaixaBank',           exchange: 'IBEX', sector: 'Financials' },
  { ticker: 'AENA.MC',  name: 'AENA',                exchange: 'IBEX', sector: 'Industrials' },
  { ticker: 'IAG.MC',   name: 'IAG',                 exchange: 'IBEX', sector: 'Industrials' },
  { ticker: 'FER.MC',   name: 'Ferrovial',           exchange: 'IBEX', sector: 'Industrials' },
  { ticker: 'ACS.MC',   name: 'ACS',                 exchange: 'IBEX', sector: 'Industrials' },
  { ticker: 'ELE.MC',   name: 'Endesa',              exchange: 'IBEX', sector: 'Utilities' },
  { ticker: 'GRF.MC',   name: 'Grifols',             exchange: 'IBEX', sector: 'Healthcare' },
  { ticker: 'BKT.MC',   name: 'Bankinter',           exchange: 'IBEX', sector: 'Financials' },
  { ticker: 'RED.MC',   name: 'RedElectrica',        exchange: 'IBEX', sector: 'Utilities' },
  { ticker: 'ACX.MC',   name: 'Acerinox',            exchange: 'IBEX', sector: 'Materials' },
  { ticker: 'MTS.MC',   name: 'ArcelorMittal (ES)',  exchange: 'IBEX', sector: 'Materials' },

  // FTSE MIB — Borsa Italiana (top 20 by market cap)
  { ticker: 'ENEL.MI',  name: 'Enel',                exchange: 'FTSE_MIB', sector: 'Utilities' },
  { ticker: 'ENI.MI',   name: 'Eni',                 exchange: 'FTSE_MIB', sector: 'Energy' },
  { ticker: 'UCG.MI',   name: 'UniCredit',           exchange: 'FTSE_MIB', sector: 'Financials' },
  { ticker: 'ISP.MI',   name: 'Intesa Sanpaolo',     exchange: 'FTSE_MIB', sector: 'Financials' },
  { ticker: 'RACE.MI',  name: 'Ferrari',             exchange: 'FTSE_MIB', sector: 'Autos' },
  { ticker: 'G.MI',     name: 'Generali',            exchange: 'FTSE_MIB', sector: 'Financials' },
  { ticker: 'TIT.MI',   name: 'Telecom Italia',      exchange: 'FTSE_MIB', sector: 'Telecoms' },
  { ticker: 'TEN.MI',   name: 'Tenaris',             exchange: 'FTSE_MIB', sector: 'Energy' },
  { ticker: 'STM.MI',   name: 'STMicroelectronics',  exchange: 'FTSE_MIB', sector: 'Technology' },
  { ticker: 'STLAM.MI', name: 'Stellantis (MI)',     exchange: 'FTSE_MIB', sector: 'Autos' },
  { ticker: 'PRY.MI',   name: 'Prysmian',            exchange: 'FTSE_MIB', sector: 'Industrials' },
  { ticker: 'MONC.MI',  name: 'Moncler',             exchange: 'FTSE_MIB', sector: 'Consumer' },
  { ticker: 'SRG.MI',   name: 'Snam',                exchange: 'FTSE_MIB', sector: 'Utilities' },
  { ticker: 'MB.MI',    name: 'Mediobanca',          exchange: 'FTSE_MIB', sector: 'Financials' },
  { ticker: 'LDO.MI',   name: 'Leonardo',            exchange: 'FTSE_MIB', sector: 'Defence' },
  { ticker: 'HER.MI',   name: 'Recordati',           exchange: 'FTSE_MIB', sector: 'Healthcare' },
  { ticker: 'BAMI.MI',  name: 'Banco BPM',           exchange: 'FTSE_MIB', sector: 'Financials' },
  { ticker: 'TRN.MI',   name: 'Terna',               exchange: 'FTSE_MIB', sector: 'Utilities' },
  { ticker: 'FBK.MI',   name: 'FinecoBank',          exchange: 'FTSE_MIB', sector: 'Financials' },
  { ticker: 'NEXI.MI',  name: 'Nexi',                exchange: 'FTSE_MIB', sector: 'Technology' },
]

// ── ETF universe ──────────────────────────────────────────────────
const ETFS = [
  // Broad index ETFs
  { ticker: 'EXS1.DE',  name: 'iShares Core DAX ETF',        exchange: 'XETRA',    sector: 'Germany Index' },
  { ticker: 'EXSA.DE',  name: 'iShares Euro Stoxx 50 ETF',   exchange: 'XETRA',    sector: 'Eurozone Index' },
  { ticker: 'ISF.L',    name: 'iShares Core FTSE 100 ETF',   exchange: 'LSE',      sector: 'UK Index' },
  { ticker: 'VEUR.L',   name: 'Vanguard FTSE Europe ETF',    exchange: 'LSE',      sector: 'Pan-Europe Index' },
  { ticker: 'MEUD.PA',  name: 'Amundi MSCI Europe ETF',      exchange: 'EURONEXT', sector: 'Pan-Europe Index' },
  { ticker: 'DXET.DE',  name: 'Xtrackers DAX ETF',           exchange: 'XETRA',    sector: 'Germany Index' },
  { ticker: 'C40.PA',   name: 'Amundi CAC 40 ETF',           exchange: 'EURONEXT', sector: 'France Index' },
  // Sector ETFs — iShares STOXX Europe 600 series
  { ticker: 'IQQH.DE',  name: 'iShares EU 600 Healthcare',   exchange: 'XETRA',    sector: 'Healthcare ETF' },
  { ticker: 'IQQF.DE',  name: 'iShares EU 600 Financials',   exchange: 'XETRA',    sector: 'Financials ETF' },
  { ticker: 'EXXT.DE',  name: 'iShares EU 600 Technology',   exchange: 'XETRA',    sector: 'Technology ETF' },
  { ticker: 'IQQD.DE',  name: 'iShares EU 600 Industrials',  exchange: 'XETRA',    sector: 'Industrials ETF' },
  { ticker: '5MVL.DE',  name: 'iShares EU 600 Energy',       exchange: 'XETRA',    sector: 'Energy ETF' },
  // Defence ETF (European rearmament theme)
  { ticker: 'DFEN.L',   name: 'VanEck Defence ETF',          exchange: 'LSE',      sector: 'Defence ETF' },
  // Bond ETFs
  { ticker: 'IBGX.L',   name: 'iShares Euro Govt Bond ETF',  exchange: 'LSE',      sector: 'Bonds EUR' },
  { ticker: 'IEAC.L',   name: 'iShares Euro Corp Bond ETF',  exchange: 'LSE',      sector: 'Bonds EUR' },
]

// ── Yahoo Finance fetch ───────────────────────────────────────────
const delay = ms => new Promise(r => setTimeout(r, ms))

async function fetchHistory(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=3mo`
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const result = json?.chart?.result?.[0]
      if (!result) throw new Error('No result in response')

      const meta       = result.meta
      const timestamps = result.timestamp ?? []
      const quote      = result.indicators?.quote?.[0] ?? {}
      const closes     = (quote.close  ?? []).map(v => v ?? null)
      const highs      = (quote.high   ?? []).map(v => v ?? null)
      const lows       = (quote.low    ?? []).map(v => v ?? null)
      const volumes    = (quote.volume ?? []).map(v => v ?? null)

      const valid = timestamps.map((_, i) => closes[i] != null && highs[i] != null && lows[i] != null)
      const c = closes.filter((_, i) => valid[i])
      const h = highs.filter((_, i)  => valid[i])
      const l = lows.filter((_, i)   => valid[i])
      const v = volumes.filter((_, i) => valid[i])

      return {
        price:     meta.regularMarketPrice,
        prevClose: meta.chartPreviousClose,
        closes: c, highs: h, lows: l, volumes: v,
      }
    } catch (err) {
      if (attempt === 3) return null
      await delay(800 * attempt)
    }
  }
  return null
}

// ── Technical indicators ──────────────────────────────────────────

function computeRSI(closes, period = 14) {
  if (closes.length < period + 1) return null
  const seed = closes.slice(-(period + 1))
  let avgGain = 0, avgLoss = 0
  for (let i = 1; i <= period; i++) {
    const d = seed[i] - seed[i - 1]
    if (d > 0) avgGain += d; else avgLoss -= d
  }
  avgGain /= period
  avgLoss /= period
  for (let i = closes.length - period + 1; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1]
    const g = d > 0 ? d : 0
    const ls = d < 0 ? -d : 0
    avgGain = (avgGain * (period - 1) + g) / period
    avgLoss = (avgLoss * (period - 1) + ls) / period
  }
  if (avgLoss === 0) return 100
  return parseFloat((100 - 100 / (1 + avgGain / avgLoss)).toFixed(1))
}

function emaArray(data, period) {
  const k = 2 / (period + 1)
  const result = new Array(data.length)
  result[0] = data[0]
  for (let i = 1; i < data.length; i++) result[i] = data[i] * k + result[i - 1] * (1 - k)
  return result
}

function computeMACD(closes, fast = 12, slow = 26, signal = 9) {
  if (closes.length < slow + signal + 1) return null
  const ema12 = emaArray(closes, fast)
  const ema26 = emaArray(closes, slow)
  const macdLine   = ema12.map((v, i) => v - ema26[i])
  const signalLine = emaArray(macdLine, signal)
  const histogram  = macdLine.map((v, i) => v - signalLine[i])
  const n = histogram.length
  const hist     = parseFloat(histogram[n - 1].toFixed(4))
  const prevHist = parseFloat(histogram[n - 2].toFixed(4))
  let crossover = null
  if (hist > 0 && prevHist <= 0) crossover = 'cross-up'
  else if (hist < 0 && prevHist >= 0) crossover = 'cross-down'
  return {
    value:     parseFloat(macdLine[n - 1].toFixed(4)),
    signal:    parseFloat(signalLine[n - 1].toFixed(4)),
    histogram: hist,
    trend:     hist > 0 ? 'bullish' : 'bearish',
    crossover,
  }
}

function computeSuperTrend(highs, lows, closes, period = 10, multiplier = 3) {
  if (closes.length < period + 2) return null
  const tr = closes.map((c, i) => {
    if (i === 0) return highs[0] - lows[0]
    return Math.max(highs[i] - lows[i], Math.abs(highs[i] - closes[i - 1]), Math.abs(lows[i] - closes[i - 1]))
  })
  let atr = tr.slice(0, period).reduce((a, b) => a + b, 0) / period
  const atrs = [atr]
  for (let i = period; i < tr.length; i++) {
    atr = (atr * (period - 1) + tr[i]) / period
    atrs.push(atr)
  }
  let trend = 1, upperBand = 0, lowerBand = 0
  for (let i = 0; i < atrs.length; i++) {
    const ci  = i + period - 1
    const hl2 = (highs[ci] + lows[ci]) / 2
    const rawUpper = hl2 + multiplier * atrs[i]
    const rawLower = hl2 - multiplier * atrs[i]
    if (i === 0) {
      upperBand = rawUpper; lowerBand = rawLower
      trend = closes[ci] >= hl2 ? 1 : -1
    } else {
      upperBand = rawUpper < upperBand || closes[ci - 1] > upperBand ? rawUpper : upperBand
      lowerBand = rawLower > lowerBand || closes[ci - 1] < lowerBand ? rawLower : lowerBand
      trend = trend === 1
        ? (closes[ci] < lowerBand ? -1 : 1)
        : (closes[ci] > upperBand ? 1 : -1)
    }
  }
  return trend === 1 ? 'bullish' : 'bearish'
}

function computeVolumeSignal(volumes, lookback = 20) {
  if (volumes.length < lookback + 1) return { signal: 'normal', ratio: null }
  const recent  = volumes[volumes.length - 1]
  const avg     = volumes.slice(-lookback - 1, -1).reduce((a, b) => a + b, 0) / lookback
  const ratio   = avg > 0 ? parseFloat((recent / avg).toFixed(2)) : null
  let signal = 'normal'
  if (ratio !== null) {
    if (ratio >= 2.0) signal = 'surge'
    else if (ratio >= 1.5) signal = 'high'
    else if (ratio <= 0.5) signal = 'low'
  }
  return { signal, ratio }
}

// ── Process one instrument ────────────────────────────────────────

async function processInstrument(item, type, index, total) {
  process.stdout.write(`  [${index}/${total}] ${item.ticker.padEnd(12)}`)
  const data = await fetchHistory(item.ticker)

  if (!data || data.closes.length < 30) {
    console.log('✗ insufficient data')
    return null
  }

  const price     = data.price
  const prevClose = data.prevClose
  const change    = price - prevClose
  const changePct = parseFloat(((change / prevClose) * 100).toFixed(2))

  const rsi        = computeRSI(data.closes)
  const macd       = computeMACD(data.closes)
  const supertrend = computeSuperTrend(data.highs, data.lows, data.closes)
  const vol        = computeVolumeSignal(data.volumes)

  const rsiSignal = rsi == null ? 'unknown'
    : rsi < 30 ? 'oversold'
    : rsi > 70 ? 'overbought'
    : 'neutral'

  console.log(`✓  price=${price.toFixed(1)} rsi=${rsi ?? '?'} macd=${macd?.trend ?? '?'} st=${supertrend ?? '?'} vol=${vol.signal}`)

  return {
    type,
    ticker:       item.ticker,
    name:         item.name,
    exchange:     item.exchange,
    sector:       item.sector,
    price:        parseFloat(price.toFixed(2)),
    change:       parseFloat(change.toFixed(2)),
    changePct,
    rsi,
    rsiSignal,
    macdTrend:    macd?.trend ?? null,
    macdHist:     macd?.histogram ?? null,
    macdCross:    macd?.crossover ?? null,
    supertrend,
    volumeSignal: vol.signal,
    volumeRatio:  vol.ratio,
  }
}

// ── Main ──────────────────────────────────────────────────────────

async function main() {
  const total = STOCKS.length + ETFS.length
  console.log(`Updating screener — ${STOCKS.length} stocks + ${ETFS.length} ETFs = ${total} instruments`)

  const results = []
  let ok = 0, failed = 0
  let i = 0

  console.log('\n── Stocks ──────────────────────────────────')
  for (const stock of STOCKS) {
    i++
    const record = await processInstrument(stock, 'stock', i, total)
    if (record) { results.push(record); ok++ } else { failed++ }
    await delay(350)
  }

  console.log('\n── ETFs ─────────────────────────────────────')
  for (const etf of ETFS) {
    i++
    const record = await processInstrument(etf, 'etf', i, total)
    if (record) { results.push(record); ok++ } else { failed++ }
    await delay(350)
  }

  const stockCount = results.filter(r => r.type === 'stock').length
  const etfCount   = results.filter(r => r.type === 'etf').length

  const output = {
    updatedAt:   new Date().toISOString(),
    stockCount,
    etfCount,
    instruments: results.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'stock' ? -1 : 1
      return a.exchange.localeCompare(b.exchange) || a.name.localeCompare(b.name)
    }),
  }

  if (!existsSync(join(ROOT, 'data'))) await mkdir(join(ROOT, 'data'), { recursive: true })
  await writeFile(OUTPUT, JSON.stringify(output, null, 2), 'utf8')
  console.log(`\n✓ Screener updated — ${stockCount} stocks, ${etfCount} ETFs, ${failed} failed → data/screener.json`)
}

main().catch(err => { console.error('Screener update failed:', err.message); process.exit(1) })
