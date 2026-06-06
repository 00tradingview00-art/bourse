/**
 * update-screener.mjs
 * Fetches 1yr daily OHLCV + fundamentals for 182 European stocks + 22 UCITS ETFs,
 * computes RSI(14), MACD(12,26,9), SuperTrend(10,3), volume signal, relative strength,
 * then writes data/screener.json with separate stocks and etfs arrays.
 *
 * Run: node scripts/update-screener.mjs
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
  { ticker: 'HEIA.AS',  name: 'Heineken',           exchange: 'AEX', sector: 'Consumer' },
  { ticker: 'IMCD.AS',  name: 'IMCD',               exchange: 'AEX', sector: 'Industrials' },
  { ticker: 'INGA.AS',  name: 'ING',                exchange: 'AEX', sector: 'Financials' },
  { ticker: 'KPN.AS',   name: 'KPN',                exchange: 'AEX', sector: 'Telecoms' },
  { ticker: 'MT.AS',    name: 'ArcelorMittal',      exchange: 'AEX', sector: 'Materials' },
  { ticker: 'NN.AS',    name: 'NN Group',           exchange: 'AEX', sector: 'Financials' },
  { ticker: 'PHIA.AS',  name: 'Philips',            exchange: 'AEX', sector: 'Healthcare' },
  { ticker: 'PRX.AS',   name: 'Prosus',             exchange: 'AEX', sector: 'Technology' },
  { ticker: 'RAND.AS',  name: 'Randstad',           exchange: 'AEX', sector: 'Industrials' },
  { ticker: 'REN.AS',   name: 'RELX (NL)',          exchange: 'AEX', sector: 'Technology' },
  { ticker: 'SHELL.AS', name: 'Shell',              exchange: 'AEX', sector: 'Energy' },
  { ticker: 'STLAM.AS', name: 'Stellantis',         exchange: 'AEX', sector: 'Autos' },
  { ticker: 'UMG.AS',   name: 'Universal Music',    exchange: 'AEX', sector: 'Consumer' },
  { ticker: 'WKL.AS',   name: 'Wolters Kluwer',     exchange: 'AEX', sector: 'Technology' },

  // DAX — Xetra Frankfurt (full 40)
  { ticker: 'ADS.DE',   name: 'Adidas',               exchange: 'DAX', sector: 'Consumer' },
  { ticker: 'ALV.DE',   name: 'Allianz',              exchange: 'DAX', sector: 'Financials' },
  { ticker: 'BAS.DE',   name: 'BASF',                 exchange: 'DAX', sector: 'Materials' },
  { ticker: 'BAYN.DE',  name: 'Bayer',                exchange: 'DAX', sector: 'Healthcare' },
  { ticker: 'BEI.DE',   name: 'Beiersdorf',           exchange: 'DAX', sector: 'Consumer' },
  { ticker: 'BMW.DE',   name: 'BMW',                  exchange: 'DAX', sector: 'Autos' },
  { ticker: 'BNR.DE',   name: 'Brenntag',             exchange: 'DAX', sector: 'Materials' },
  { ticker: 'CBK.DE',   name: 'Commerzbank',          exchange: 'DAX', sector: 'Financials' },
  { ticker: 'CON.DE',   name: 'Continental',          exchange: 'DAX', sector: 'Autos' },
  { ticker: '1COV.DE',  name: 'Covestro',             exchange: 'DAX', sector: 'Materials' },
  { ticker: 'DB1.DE',   name: 'Deutsche Boerse',      exchange: 'DAX', sector: 'Financials' },
  { ticker: 'DBK.DE',   name: 'Deutsche Bank',        exchange: 'DAX', sector: 'Financials' },
  { ticker: 'DHL.DE',   name: 'DHL Group',            exchange: 'DAX', sector: 'Industrials' },
  { ticker: 'DTE.DE',   name: 'Deutsche Telekom',     exchange: 'DAX', sector: 'Telecoms' },
  { ticker: 'DTG.DE',   name: 'Daimler Truck',        exchange: 'DAX', sector: 'Autos' },
  { ticker: 'EOAN.DE',  name: 'E.ON',                 exchange: 'DAX', sector: 'Utilities' },
  { ticker: 'ENR.DE',   name: 'Siemens Energy',       exchange: 'DAX', sector: 'Energy' },
  { ticker: 'FRE.DE',   name: 'Fresenius',            exchange: 'DAX', sector: 'Healthcare' },
  { ticker: 'G1A.DE',   name: 'GEA Group',            exchange: 'DAX', sector: 'Industrials' },
  { ticker: 'G24.DE',   name: 'Scout24',              exchange: 'DAX', sector: 'Technology' },
  { ticker: 'HEI.DE',   name: 'Heidelberg Materials', exchange: 'DAX', sector: 'Materials' },
  { ticker: 'HEN3.DE',  name: 'Henkel',               exchange: 'DAX', sector: 'Consumer' },
  { ticker: 'HNR1.DE',  name: 'Hannover Re',          exchange: 'DAX', sector: 'Financials' },
  { ticker: 'IFX.DE',   name: 'Infineon',             exchange: 'DAX', sector: 'Technology' },
  { ticker: 'LIN.DE',   name: 'Linde',                exchange: 'DAX', sector: 'Materials' },
  { ticker: 'MBG.DE',   name: 'Mercedes-Benz',        exchange: 'DAX', sector: 'Autos' },
  { ticker: 'MRK.DE',   name: 'Merck KGaA',           exchange: 'DAX', sector: 'Healthcare' },
  { ticker: 'MTX.DE',   name: 'MTU Aero Engines',     exchange: 'DAX', sector: 'Industrials' },
  { ticker: 'MUV2.DE',  name: 'Munich Re',            exchange: 'DAX', sector: 'Financials' },
  { ticker: 'PAH3.DE',  name: 'Porsche SE',           exchange: 'DAX', sector: 'Autos' },
  { ticker: 'QIA.DE',   name: 'QIAGEN',               exchange: 'DAX', sector: 'Healthcare' },
  { ticker: 'RHM.DE',   name: 'Rheinmetall',          exchange: 'DAX', sector: 'Defence' },
  { ticker: 'RWE.DE',   name: 'RWE',                  exchange: 'DAX', sector: 'Utilities' },
  { ticker: 'SAP.DE',   name: 'SAP',                  exchange: 'DAX', sector: 'Technology' },
  { ticker: 'SHL.DE',   name: 'Siemens Healthineers', exchange: 'DAX', sector: 'Healthcare' },
  { ticker: 'SIE.DE',   name: 'Siemens',              exchange: 'DAX', sector: 'Industrials' },
  { ticker: 'SY1.DE',   name: 'Symrise',              exchange: 'DAX', sector: 'Materials' },
  { ticker: 'VNA.DE',   name: 'Vonovia',              exchange: 'DAX', sector: 'Real Estate' },
  { ticker: 'VOW3.DE',  name: 'Volkswagen',           exchange: 'DAX', sector: 'Autos' },
  { ticker: 'ZAL.DE',   name: 'Zalando',              exchange: 'DAX', sector: 'Consumer' },

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
  { ticker: 'AZN.L',    name: 'AstraZeneca',        exchange: 'FTSE', sector: 'Healthcare' },
  { ticker: 'HSBA.L',   name: 'HSBC',               exchange: 'FTSE', sector: 'Financials' },
  { ticker: 'SHEL.L',   name: 'Shell',              exchange: 'FTSE', sector: 'Energy' },
  { ticker: 'ULVR.L',   name: 'Unilever',           exchange: 'FTSE', sector: 'Consumer' },
  { ticker: 'REL.L',    name: 'RELX',               exchange: 'FTSE', sector: 'Technology' },
  { ticker: 'BP.L',     name: 'BP',                 exchange: 'FTSE', sector: 'Energy' },
  { ticker: 'GSK.L',    name: 'GSK',                exchange: 'FTSE', sector: 'Healthcare' },
  { ticker: 'RIO.L',    name: 'Rio Tinto',          exchange: 'FTSE', sector: 'Materials' },
  { ticker: 'BA.L',     name: 'BAE Systems',        exchange: 'FTSE', sector: 'Defence' },
  { ticker: 'BARC.L',   name: 'Barclays',           exchange: 'FTSE', sector: 'Financials' },
  { ticker: 'LLOY.L',   name: 'Lloyds',             exchange: 'FTSE', sector: 'Financials' },
  { ticker: 'NG.L',     name: 'National Grid',      exchange: 'FTSE', sector: 'Utilities' },
  { ticker: 'DGE.L',    name: 'Diageo',             exchange: 'FTSE', sector: 'Consumer' },
  { ticker: 'RKT.L',    name: 'Reckitt',            exchange: 'FTSE', sector: 'Consumer' },
  { ticker: 'VOD.L',    name: 'Vodafone',           exchange: 'FTSE', sector: 'Telecoms' },
  { ticker: 'STAN.L',   name: 'Standard Chartered', exchange: 'FTSE', sector: 'Financials' },
  { ticker: 'HLN.L',    name: 'Haleon',             exchange: 'FTSE', sector: 'Healthcare' },
  { ticker: 'CPG.L',    name: 'Compass Group',      exchange: 'FTSE', sector: 'Consumer' },
  { ticker: 'SSE.L',    name: 'SSE',                exchange: 'FTSE', sector: 'Utilities' },
  { ticker: 'LGEN.L',   name: 'Legal & General',    exchange: 'FTSE', sector: 'Financials' },
  { ticker: 'WPP.L',    name: 'WPP',                exchange: 'FTSE', sector: 'Consumer' },
  { ticker: 'FRES.L',   name: 'Fresnillo',          exchange: 'FTSE', sector: 'Materials' },
  { ticker: 'PRU.L',    name: 'Prudential',         exchange: 'FTSE', sector: 'Financials' },
  { ticker: 'IHG.L',    name: 'IHG Hotels',         exchange: 'FTSE', sector: 'Consumer' },
  { ticker: 'BT.L',     name: 'BT Group',           exchange: 'FTSE', sector: 'Telecoms' },
  { ticker: 'MKS.L',    name: 'Marks & Spencer',    exchange: 'FTSE', sector: 'Consumer' },
  { ticker: 'EXPN.L',   name: 'Experian',           exchange: 'FTSE', sector: 'Technology' },
  { ticker: 'RMV.L',    name: 'Rightmove',          exchange: 'FTSE', sector: 'Technology' },
  { ticker: 'PSON.L',   name: 'Pearson',            exchange: 'FTSE', sector: 'Consumer' },
  { ticker: 'AUTO.L',   name: 'Auto Trader',        exchange: 'FTSE', sector: 'Technology' },

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
  { ticker: 'ENEL.MI',  name: 'Enel',               exchange: 'FTSE_MIB', sector: 'Utilities' },
  { ticker: 'ENI.MI',   name: 'Eni',                exchange: 'FTSE_MIB', sector: 'Energy' },
  { ticker: 'UCG.MI',   name: 'UniCredit',          exchange: 'FTSE_MIB', sector: 'Financials' },
  { ticker: 'ISP.MI',   name: 'Intesa Sanpaolo',    exchange: 'FTSE_MIB', sector: 'Financials' },
  { ticker: 'RACE.MI',  name: 'Ferrari',            exchange: 'FTSE_MIB', sector: 'Autos' },
  { ticker: 'G.MI',     name: 'Generali',           exchange: 'FTSE_MIB', sector: 'Financials' },
  { ticker: 'TIT.MI',   name: 'Telecom Italia',     exchange: 'FTSE_MIB', sector: 'Telecoms' },
  { ticker: 'TEN.MI',   name: 'Tenaris',            exchange: 'FTSE_MIB', sector: 'Energy' },
  { ticker: 'STM.MI',   name: 'STMicroelectronics', exchange: 'FTSE_MIB', sector: 'Technology' },
  { ticker: 'STLAM.MI', name: 'Stellantis (MI)',    exchange: 'FTSE_MIB', sector: 'Autos' },
  { ticker: 'PRY.MI',   name: 'Prysmian',           exchange: 'FTSE_MIB', sector: 'Industrials' },
  { ticker: 'MONC.MI',  name: 'Moncler',            exchange: 'FTSE_MIB', sector: 'Consumer' },
  { ticker: 'SRG.MI',   name: 'Snam',               exchange: 'FTSE_MIB', sector: 'Utilities' },
  { ticker: 'MB.MI',    name: 'Mediobanca',         exchange: 'FTSE_MIB', sector: 'Financials' },
  { ticker: 'LDO.MI',   name: 'Leonardo',           exchange: 'FTSE_MIB', sector: 'Defence' },
  { ticker: 'HER.MI',   name: 'Recordati',          exchange: 'FTSE_MIB', sector: 'Healthcare' },
  { ticker: 'BAMI.MI',  name: 'Banco BPM',          exchange: 'FTSE_MIB', sector: 'Financials' },
  { ticker: 'TRN.MI',   name: 'Terna',              exchange: 'FTSE_MIB', sector: 'Utilities' },
  { ticker: 'FBK.MI',   name: 'FinecoBank',         exchange: 'FTSE_MIB', sector: 'Financials' },
  { ticker: 'NEXI.MI',  name: 'Nexi',               exchange: 'FTSE_MIB', sector: 'Technology' },

  // OMX Stockholm — Sweden (10 stocks)
  { ticker: 'VOLV-B.ST', name: 'Volvo',                 exchange: 'OMX', sector: 'Industrials' },
  { ticker: 'ERIC-B.ST', name: 'Ericsson',              exchange: 'OMX', sector: 'Technology' },
  { ticker: 'ATCO-A.ST', name: 'Atlas Copco',           exchange: 'OMX', sector: 'Industrials' },
  { ticker: 'SWED-A.ST', name: 'Swedbank',              exchange: 'OMX', sector: 'Financials' },
  { ticker: 'HM-B.ST',   name: 'H&M',                  exchange: 'OMX', sector: 'Consumer' },
  { ticker: 'NDA-SE.ST', name: 'Nordea',                exchange: 'OMX', sector: 'Financials' },
  { ticker: 'SAND.ST',   name: 'Sandvik',               exchange: 'OMX', sector: 'Industrials' },
  { ticker: 'SEB-A.ST',  name: 'SEB',                   exchange: 'OMX', sector: 'Financials' },
  { ticker: 'SHB-A.ST',  name: 'Svenska Handelsbanken', exchange: 'OMX', sector: 'Financials' },
  { ticker: 'SKF-B.ST',  name: 'SKF',                   exchange: 'OMX', sector: 'Industrials' },
]

// ── ETF universe (22 UCITS ETFs with static metadata) ─────────────
const ETFS = [
  // Global / All-World
  { ticker: 'IWDA.AS', name: 'iShares Core MSCI World',        exchange: 'EURONEXT', indexTracked: 'MSCI World',             category: 'Global',   ter: 0.20, aumB: 80.2, domicile: 'IE', accumulating: true,  sfdr: 'Art.8', replication: 'physical', brokerBadges: ['DEGIRO'] },
  { ticker: 'VWCE.DE', name: 'Vanguard FTSE All-World Acc',    exchange: 'XETRA',    indexTracked: 'FTSE All-World',          category: 'Global',   ter: 0.22, aumB: 45.1, domicile: 'IE', accumulating: true,  sfdr: 'Art.6', replication: 'physical', brokerBadges: ['DEGIRO', 'TR'] },
  { ticker: 'SWDA.AS', name: 'iShares MSCI World Dist',        exchange: 'EURONEXT', indexTracked: 'MSCI World',             category: 'Global',   ter: 0.20, aumB: 12.4, domicile: 'IE', accumulating: false, sfdr: 'Art.8', replication: 'physical', brokerBadges: ['DEGIRO'] },
  { ticker: 'VWRL.AS', name: 'Vanguard FTSE All-World Dist',   exchange: 'EURONEXT', indexTracked: 'FTSE All-World',          category: 'Global',   ter: 0.22, aumB:  8.3, domicile: 'IE', accumulating: false, sfdr: 'Art.6', replication: 'physical', brokerBadges: ['DEGIRO', 'TR'] },
  { ticker: 'WSML.AS', name: 'iShares MSCI World Small Cap',   exchange: 'EURONEXT', indexTracked: 'MSCI World Small Cap',   category: 'Global',   ter: 0.35, aumB:  3.2, domicile: 'IE', accumulating: true,  sfdr: 'Art.6', replication: 'physical', brokerBadges: ['DEGIRO'] },
  // US
  { ticker: 'CSPX.AS', name: 'iShares Core S&P 500',           exchange: 'EURONEXT', indexTracked: 'S&P 500',                category: 'US',       ter: 0.07, aumB: 82.5, domicile: 'IE', accumulating: true,  sfdr: 'Art.6', replication: 'physical', brokerBadges: ['DEGIRO'] },
  { ticker: 'VUSA.AS', name: 'Vanguard S&P 500 Acc',           exchange: 'EURONEXT', indexTracked: 'S&P 500',                category: 'US',       ter: 0.07, aumB: 42.1, domicile: 'IE', accumulating: true,  sfdr: 'Art.6', replication: 'physical', brokerBadges: ['DEGIRO', 'TR'] },
  { ticker: 'SXR8.DE', name: 'iShares Core S&P 500 (Xetra)',   exchange: 'XETRA',    indexTracked: 'S&P 500',                category: 'US',       ter: 0.07, aumB: 30.2, domicile: 'IE', accumulating: true,  sfdr: 'Art.6', replication: 'physical', brokerBadges: ['TR'] },
  // Europe
  { ticker: 'IMEU.AS', name: 'iShares Core MSCI Europe',       exchange: 'EURONEXT', indexTracked: 'MSCI Europe',            category: 'Europe',   ter: 0.12, aumB:  6.8, domicile: 'IE', accumulating: true,  sfdr: 'Art.8', replication: 'physical', brokerBadges: ['DEGIRO'] },
  { ticker: 'MEUD.PA', name: 'Amundi MSCI Europe Dist',        exchange: 'EURONEXT', indexTracked: 'MSCI Europe',            category: 'Europe',   ter: 0.12, aumB:  3.9, domicile: 'LU', accumulating: false, sfdr: 'Art.6', replication: 'physical', brokerBadges: [] },
  { ticker: 'EXW1.DE', name: 'iShares Core Euro Stoxx 50',     exchange: 'XETRA',    indexTracked: 'Euro Stoxx 50',          category: 'Europe',   ter: 0.10, aumB:  7.4, domicile: 'DE', accumulating: true,  sfdr: 'Art.6', replication: 'physical', brokerBadges: ['TR'] },
  // Emerging Markets
  { ticker: 'EIMI.AS', name: 'iShares Core MSCI EM IMI',       exchange: 'EURONEXT', indexTracked: 'MSCI Emerging Markets',  category: 'EM',       ter: 0.18, aumB: 20.3, domicile: 'IE', accumulating: true,  sfdr: 'Art.6', replication: 'physical', brokerBadges: ['DEGIRO'] },
  { ticker: 'VFEM.AS', name: 'Vanguard FTSE Emerging Markets', exchange: 'EURONEXT', indexTracked: 'FTSE Emerging Markets',  category: 'EM',       ter: 0.22, aumB:  4.1, domicile: 'IE', accumulating: true,  sfdr: 'Art.6', replication: 'physical', brokerBadges: ['DEGIRO'] },
  // ESG
  { ticker: 'MVEE.AS', name: 'iShares MSCI World ESG Enhanced',exchange: 'EURONEXT', indexTracked: 'MSCI World ESG',         category: 'ESG',      ter: 0.20, aumB:  9.2, domicile: 'IE', accumulating: true,  sfdr: 'Art.8', replication: 'physical', brokerBadges: ['DEGIRO'] },
  { ticker: 'SUSW.AS', name: 'iShares MSCI World SRI',         exchange: 'EURONEXT', indexTracked: 'MSCI World SRI',         category: 'ESG',      ter: 0.20, aumB:  2.7, domicile: 'IE', accumulating: true,  sfdr: 'Art.9', replication: 'physical', brokerBadges: [] },
  // Factor
  { ticker: 'IWMO.AS', name: 'iShares MSCI World Momentum',    exchange: 'EURONEXT', indexTracked: 'MSCI World Momentum',    category: 'Factor',   ter: 0.30, aumB:  2.8, domicile: 'IE', accumulating: true,  sfdr: 'Art.6', replication: 'physical', brokerBadges: [] },
  { ticker: 'IWQU.AS', name: 'iShares MSCI World Quality',     exchange: 'EURONEXT', indexTracked: 'MSCI World Quality',     category: 'Factor',   ter: 0.30, aumB:  3.6, domicile: 'IE', accumulating: true,  sfdr: 'Art.6', replication: 'physical', brokerBadges: [] },
  { ticker: 'IWVL.AS', name: 'iShares MSCI World Value',       exchange: 'EURONEXT', indexTracked: 'MSCI World Value',       category: 'Factor',   ter: 0.30, aumB:  1.9, domicile: 'IE', accumulating: true,  sfdr: 'Art.6', replication: 'physical', brokerBadges: [] },
  // Bonds
  { ticker: 'IBGS.AS', name: 'iShares Core Euro Govt Bond',    exchange: 'EURONEXT', indexTracked: 'Bloomberg Euro Govt',    category: 'Bonds',    ter: 0.09, aumB:  5.6, domicile: 'IE', accumulating: true,  sfdr: 'Art.6', replication: 'physical', brokerBadges: ['DEGIRO'] },
  { ticker: 'AGGH.AS', name: 'iShares Core Global Agg Bond',   exchange: 'EURONEXT', indexTracked: 'Bloomberg Global Agg',   category: 'Bonds',    ter: 0.10, aumB:  8.1, domicile: 'IE', accumulating: true,  sfdr: 'Art.6', replication: 'physical', brokerBadges: ['DEGIRO'] },
  // Thematic / Sector
  { ticker: 'EXV6.DE', name: 'iShares STOXX EU 600 Banks',     exchange: 'XETRA',    indexTracked: 'STOXX EU 600 Banks',     category: 'Thematic', ter: 0.46, aumB:  1.8, domicile: 'DE', accumulating: true,  sfdr: 'Art.6', replication: 'physical', brokerBadges: ['TR'] },
  { ticker: 'IQQH.DE', name: 'iShares Global Clean Energy',    exchange: 'XETRA',    indexTracked: 'S&P Global Clean Energy', category: 'Thematic', ter: 0.65, aumB:  2.3, domicile: 'IE', accumulating: true,  sfdr: 'Art.8', replication: 'physical', brokerBadges: ['TR'] },
]

// ── Benchmark indices for relative strength ──────────────────────
const BENCHMARKS = {
  AEX:      '^AEX',
  DAX:      '^GDAXI',
  CAC:      '^FCHI',
  FTSE:     '^FTSE',
  IBEX:     '^IBEX',
  FTSE_MIB: '^FTMIB',
  OMX:      '^OMX',
}

// ── Helpers ───────────────────────────────────────────────────────
const delay = ms => new Promise(r => setTimeout(r, ms))

function mapAnalyst(key) {
  if (!key) return null
  const k = key.toLowerCase().replace('_', '')
  if (k === 'strongbuy') return 'Strong Buy'
  if (k === 'buy')       return 'Buy'
  if (k === 'hold' || k === 'neutral') return 'Hold'
  if (k === 'sell' || k === 'underperform') return 'Sell'
  return null
}

function computeQualityScore(ter, aumB, domicile, replication) {
  let score = 10
  if      (ter > 0.50) score -= 3
  else if (ter > 0.30) score -= 2
  else if (ter > 0.20) score -= 1
  if      (aumB >= 20) { /* no change */ }
  else if (aumB >=  5) score -= 1
  else if (aumB >=  1) score -= 2
  else                 score -= 3
  if (domicile === 'IE') score += 1
  if (domicile === 'LU') score -= 1
  if (replication !== 'physical') score -= 1
  return Math.max(1, Math.min(10, score))
}

function computeReturn30d(closes) {
  if (!closes || closes.length < 22) return null
  const start = closes[closes.length - 22]
  const end   = closes[closes.length - 1]
  if (!start || start === 0) return null
  return parseFloat(((end - start) / start * 100).toFixed(2))
}

// ── Yahoo Finance fetches ─────────────────────────────────────────

async function fetchHistory(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1y`
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(12000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const result = json?.chart?.result?.[0]
      if (!result) throw new Error('No result')

      const meta       = result.meta
      const timestamps = result.timestamp ?? []
      const quote      = result.indicators?.quote?.[0] ?? {}
      const closes     = (quote.close  ?? []).map(v => v ?? null)
      const highs      = (quote.high   ?? []).map(v => v ?? null)
      const lows       = (quote.low    ?? []).map(v => v ?? null)
      const volumes    = (quote.volume ?? []).map(v => v ?? null)

      const valid = timestamps.map((_, i) => closes[i] != null && highs[i] != null && lows[i] != null)
      return {
        price:     meta.regularMarketPrice,
        prevClose: meta.chartPreviousClose,
        closes:  closes.filter((_, i) => valid[i]),
        highs:   highs.filter((_, i)  => valid[i]),
        lows:    lows.filter((_, i)   => valid[i]),
        volumes: volumes.filter((_, i) => valid[i]),
      }
    } catch (err) {
      if (attempt === 3) return null
      await delay(800 * attempt)
    }
  }
  return null
}

async function fetchQuoteBatch(tickers) {
  const syms = tickers.map(t => encodeURIComponent(t)).join(',')
  const url  = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${syms}`
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return {}
    const json = await res.json()
    const result = {}
    for (const q of (json?.quoteResponse?.result ?? [])) {
      result[q.symbol] = {
        peRatio:       q.trailingPE       ? parseFloat(q.trailingPE.toFixed(1))            : null,
        dividendYield: q.dividendYield    ? parseFloat((q.dividendYield * 100).toFixed(2)) : null,
        marketCapB:    q.marketCap        ? parseFloat((q.marketCap / 1e9).toFixed(1))     : null,
        analystGrade:  mapAnalyst(q.recommendationKey),
        week52High:    q.fiftyTwoWeekHigh ?? null,
        week52Low:     q.fiftyTwoWeekLow  ?? null,
      }
    }
    return result
  } catch {
    return {}
  }
}

async function fetchAllQuotes(tickers) {
  const result = {}
  for (let i = 0; i < tickers.length; i += 20) {
    const batch = tickers.slice(i, i + 20)
    const data  = await fetchQuoteBatch(batch)
    Object.assign(result, data)
    if (i + 20 < tickers.length) await delay(600)
  }
  return result
}

async function fetchBenchmarkReturns() {
  const returns = {}
  for (const [exchange, ticker] of Object.entries(BENCHMARKS)) {
    const data = await fetchHistory(ticker)
    returns[exchange] = (data && data.closes.length >= 22) ? computeReturn30d(data.closes) : null
    await delay(350)
  }
  return returns
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
    const d  = closes[i] - closes[i - 1]
    const g  = d > 0 ? d : 0
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
  const ema12      = emaArray(closes, fast)
  const ema26      = emaArray(closes, slow)
  const macdLine   = ema12.map((v, i) => v - ema26[i])
  const signalLine = emaArray(macdLine, signal)
  const histogram  = macdLine.map((v, i) => v - signalLine[i])
  const n    = histogram.length
  const hist = parseFloat(histogram[n - 1].toFixed(4))
  const prev = parseFloat(histogram[n - 2].toFixed(4))
  let crossover = null
  if (hist > 0 && prev <= 0)       crossover = 'cross-up'
  else if (hist < 0 && prev >= 0)  crossover = 'cross-down'
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
  const recent = volumes[volumes.length - 1]
  const avg    = volumes.slice(-lookback - 1, -1).reduce((a, b) => a + b, 0) / lookback
  const ratio  = avg > 0 ? parseFloat((recent / avg).toFixed(2)) : null
  let signal = 'normal'
  if (ratio !== null) {
    if (ratio >= 2.0) signal = 'surge'
    else if (ratio >= 1.5) signal = 'high'
    else if (ratio <= 0.5) signal = 'low'
  }
  return { signal, ratio }
}

// ── Process instruments ───────────────────────────────────────────

async function processStock(item, quotes, benchmarkReturns, index, total) {
  process.stdout.write(`  [${index}/${total}] ${item.ticker.padEnd(14)}`)
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
  const return30d  = computeReturn30d(data.closes)

  const rsiSignal = rsi == null ? 'unknown' : rsi < 30 ? 'oversold' : rsi > 70 ? 'overbought' : 'neutral'

  const benchmark        = benchmarkReturns[item.exchange] ?? null
  const relativeStrength = (return30d != null && benchmark != null)
    ? parseFloat((return30d - benchmark).toFixed(2))
    : null

  const quote = quotes[item.ticker] ?? {}

  console.log(`✓  ${price.toFixed(1).padStart(8)}  rsi=${String(rsi ?? '?').padEnd(5)}  pe=${String(quote.peRatio ?? '—').padEnd(6)}  ${quote.analystGrade ?? '—'}`)

  return {
    type:             'stock',
    ticker:           item.ticker,
    name:             item.name,
    exchange:         item.exchange,
    sector:           item.sector,
    price:            parseFloat(price.toFixed(2)),
    change:           parseFloat(change.toFixed(2)),
    changePct,
    peRatio:          quote.peRatio       ?? null,
    dividendYield:    quote.dividendYield ?? null,
    marketCapB:       quote.marketCapB    ?? null,
    analystGrade:     quote.analystGrade  ?? null,
    week52High:       quote.week52High    ?? null,
    week52Low:        quote.week52Low     ?? null,
    relativeStrength,
    rsi,
    rsiSignal,
    macdTrend:        macd?.trend      ?? null,
    macdHist:         macd?.histogram  ?? null,
    macdCross:        macd?.crossover  ?? null,
    supertrend,
    volumeSignal:     vol.signal,
    volumeRatio:      vol.ratio,
  }
}

async function processEtf(item, index, total) {
  process.stdout.write(`  [${index}/${total}] ${item.ticker.padEnd(14)}`)
  const data = await fetchHistory(item.ticker)

  if (!data || data.closes.length < 30) {
    console.log('✗ insufficient data')
    return null
  }

  const price     = data.price
  const prevClose = data.prevClose
  const changePct = parseFloat(((price - prevClose) / prevClose * 100).toFixed(2))

  const rsi       = computeRSI(data.closes)
  const rsiSignal = rsi == null ? 'unknown' : rsi < 30 ? 'oversold' : rsi > 70 ? 'overbought' : 'neutral'

  const week52High = data.highs.length > 0  ? parseFloat(Math.max(...data.highs).toFixed(2)) : null
  const week52Low  = data.lows.length  > 0  ? parseFloat(Math.min(...data.lows).toFixed(2))  : null
  const qualityScore = computeQualityScore(item.ter, item.aumB, item.domicile, item.replication)

  console.log(`✓  ${price.toFixed(2).padStart(8)}  rsi=${String(rsi ?? '?').padEnd(5)}  quality=${qualityScore}`)

  return {
    type:          'etf',
    ticker:        item.ticker,
    name:          item.name,
    exchange:      item.exchange,
    indexTracked:  item.indexTracked,
    category:      item.category,
    ter:           item.ter,
    aumB:          item.aumB,
    domicile:      item.domicile,
    accumulating:  item.accumulating,
    sfdr:          item.sfdr,
    replication:   item.replication,
    brokerBadges:  item.brokerBadges,
    qualityScore,
    price:         parseFloat(price.toFixed(2)),
    changePct,
    week52High,
    week52Low,
    rsi,
    rsiSignal,
  }
}

// ── Main ──────────────────────────────────────────────────────────

async function main() {
  console.log(`Boursee Screener Update — ${STOCKS.length} stocks · ${ETFS.length} ETFs`)

  console.log('\nFetching benchmark returns...')
  const benchmarkReturns = await fetchBenchmarkReturns()
  const benchmarkSummary = Object.entries(benchmarkReturns).map(([k, v]) => `${k}=${v != null ? v.toFixed(1)+'%' : '?'}`).join(' · ')
  console.log(`  ${benchmarkSummary}`)

  console.log(`\nFetching fundamental quotes (${STOCKS.length} stocks in batches of 20)...`)
  const quotes = await fetchAllQuotes(STOCKS.map(s => s.ticker))
  console.log(`  Got quotes for ${Object.keys(quotes).length}/${STOCKS.length} stocks`)

  const stockResults = []
  const etfResults   = []
  let failed = 0
  const total = STOCKS.length + ETFS.length
  let i = 0

  console.log('\n── Stocks ──────────────────────────────────────────────────')
  for (const stock of STOCKS) {
    i++
    const record = await processStock(stock, quotes, benchmarkReturns, i, total)
    if (record) { stockResults.push(record) } else { failed++ }
    await delay(350)
  }

  console.log('\n── ETFs ─────────────────────────────────────────────────────')
  for (const etf of ETFS) {
    i++
    const record = await processEtf(etf, i, total)
    if (record) { etfResults.push(record) } else { failed++ }
    await delay(350)
  }

  const output = {
    updatedAt:  new Date().toISOString(),
    stockCount: stockResults.length,
    etfCount:   etfResults.length,
    stocks:     stockResults.sort((a, b) => a.exchange.localeCompare(b.exchange) || a.name.localeCompare(b.name)),
    etfs:       etfResults.sort((a, b) => b.qualityScore - a.qualityScore || a.name.localeCompare(b.name)),
  }

  if (!existsSync(join(ROOT, 'data'))) await mkdir(join(ROOT, 'data'), { recursive: true })
  await writeFile(OUTPUT, JSON.stringify(output, null, 2), 'utf8')
  console.log(`\n✓ ${stockResults.length} stocks · ${etfResults.length} ETFs · ${failed} failed → data/screener.json`)
}

main().catch(err => { console.error('Screener update failed:', err.message); process.exit(1) })
