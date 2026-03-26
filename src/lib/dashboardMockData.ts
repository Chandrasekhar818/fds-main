import {
  MarketDirectionSummary,
  InsiderSummary,
  InstitutionalSummary,
  CotSnapshot,
  SmartMoneySignal,
  SmartMoneyScore,
  TopMover,
} from '@/types/dashboard';

// ─── Market Direction ─────────────────────────────────────────────────────
export const mockMarketDirection: MarketDirectionSummary = {
  overallTrend:        'Bullish',
  trendStrength:       68,
  institutionalNetFlow: 4_820_000_000,
  insiderSentiment:    'Bullish',
  insiderNetFlow:      312_450_000,
  cotBias:             'Bullish',
  cotStrength:         74,
  lastUpdated:         '2024-01-26T16:00:00Z',
};

// ─── Insider Summary ──────────────────────────────────────────────────────
export const mockInsiderSummary: InsiderSummary = {
  totalBuyValue:  487_230_000,
  totalSellValue: 174_780_000,
  netFlow:        312_450_000,
  topTrades: [
    { id: 'i1', ticker: 'NVDA', insiderName: 'Jensen Huang',    role: 'CEO',      type: 'Buy',  shares: 120_000, price: 485.20, totalValue: 58_224_000, date: '2024-01-24' },
    { id: 'i2', ticker: 'META', insiderName: 'Mark Zuckerberg', role: 'Chairman', type: 'Buy',  shares:  80_000, price: 392.50, totalValue: 31_400_000, date: '2024-01-23' },
    { id: 'i3', ticker: 'MSFT', insiderName: 'Satya Nadella',   role: 'CEO',      type: 'Buy',  shares:  50_000, price: 408.10, totalValue: 20_405_000, date: '2024-01-22' },
    { id: 'i4', ticker: 'TSLA', insiderName: 'Elon Musk',       role: 'CEO',      type: 'Sell', shares: 200_000, price: 218.80, totalValue: 43_760_000, date: '2024-01-21' },
    { id: 'i5', ticker: 'AAPL', insiderName: 'Tim Cook',        role: 'CEO',      type: 'Sell', shares:  30_000, price: 194.50, totalValue:  5_835_000, date: '2024-01-20' },
  ],
};

// ─── Institutional Summary ────────────────────────────────────────────────
export const mockInstitutionalSummary: InstitutionalSummary = {
  totalNetFlow: 4_820_000_000,
  topAccumulated: [
    { ticker: 'NVDA', name: 'NVIDIA Corp',       netFlow:  2_140_000_000, buyValue: 2_560_000_000, sellValue:  420_000_000, institutions: 284 },
    { ticker: 'MSFT', name: 'Microsoft Corp',    netFlow:  1_380_000_000, buyValue: 1_820_000_000, sellValue:  440_000_000, institutions: 312 },
    { ticker: 'META', name: 'Meta Platforms',    netFlow:    920_000_000, buyValue: 1_100_000_000, sellValue:  180_000_000, institutions: 198 },
    { ticker: 'GOOGL', name: 'Alphabet Inc',     netFlow:    680_000_000, buyValue:   890_000_000, sellValue:  210_000_000, institutions: 241 },
    { ticker: 'AMD',  name: 'Advanced Micro Dev',netFlow:    540_000_000, buyValue:   710_000_000, sellValue:  170_000_000, institutions: 156 },
  ],
  topDistributed: [
    { ticker: 'TSLA', name: 'Tesla Inc',         netFlow: -1_240_000_000, buyValue:  380_000_000, sellValue: 1_620_000_000, institutions: 267 },
    { ticker: 'INTC', name: 'Intel Corp',        netFlow:   -840_000_000, buyValue:  210_000_000, sellValue: 1_050_000_000, institutions: 189 },
    { ticker: 'PYPL', name: 'PayPal Holdings',   netFlow:   -560_000_000, buyValue:  140_000_000, sellValue:   700_000_000, institutions: 132 },
    { ticker: 'DIS',  name: 'Walt Disney Co',    netFlow:   -380_000_000, buyValue:  120_000_000, sellValue:   500_000_000, institutions: 114 },
    { ticker: 'PFE',  name: 'Pfizer Inc',        netFlow:   -290_000_000, buyValue:   80_000_000, sellValue:   370_000_000, institutions: 97  },
  ],
};

// ─── COT Snapshots ────────────────────────────────────────────────────────
export const mockCotData: CotSnapshot[] = [
  { market: 'Gold (GC)',     report_date: '2024-01-23', commercial_net: -182_400, speculator_net: 176_300, open_interest: 512_000, bias: 'Bullish',  biasStrength: 78 },
  { market: 'Crude Oil (CL)',report_date: '2024-01-23', commercial_net:  -91_200, speculator_net:  84_600, open_interest: 298_000, bias: 'Bullish',  biasStrength: 62 },
  { market: 'EUR/USD (6E)',  report_date: '2024-01-23', commercial_net:   42_800, speculator_net: -38_100, open_interest: 674_000, bias: 'Bearish',  biasStrength: 55 },
  { market: 'S&P 500 (ES)',  report_date: '2024-01-23', commercial_net:  -24_600, speculator_net:  21_400, open_interest: 118_000, bias: 'Bullish',  biasStrength: 71 },
  { market: 'Corn (ZC)',     report_date: '2024-01-23', commercial_net:   58_200, speculator_net: -53_700, open_interest: 1_380_000, bias: 'Bearish', biasStrength: 48 },
];

// ─── Smart Money Signals ──────────────────────────────────────────────────
export const mockSignals: SmartMoneySignal[] = [
  {
    id: 's1',
    ticker: 'NVDA',
    type: 'Strong Buy',
    title: 'Triple Confluence — Strong Buy',
    description: 'CEO insider purchase of $58M coincides with institutional accumulation of $2.1B and bullish COT positioning. Price in confirmed uptrend.',
    confidence: 91,
    sources: ['Insider Buy', 'Institutional Inflow', 'Price Uptrend'],
    date: '2024-01-24',
  },
  {
    id: 's2',
    ticker: 'MSFT',
    type: 'Accumulation',
    title: 'Institutional Accumulation',
    description: 'Strong institutional inflow of $1.38B across 312 funds. Insider CEO purchase supports thesis. Consolidating near all-time highs.',
    confidence: 78,
    sources: ['Institutional Inflow', 'Insider Buy'],
    date: '2024-01-23',
  },
  {
    id: 's3',
    ticker: 'META',
    type: 'Accumulation',
    title: 'Smart Money Accumulation',
    description: 'Institutional net inflow of $920M with insider buying detected. Price trend bullish. High-conviction accumulation pattern.',
    confidence: 74,
    sources: ['Insider Buy', 'Institutional Inflow'],
    date: '2024-01-23',
  },
  {
    id: 's4',
    ticker: 'TSLA',
    type: 'Distribution Warning',
    title: 'Distribution Warning',
    description: 'CEO sold $43.7M in shares while institutional outflow reached $1.24B. Price trend weakening. Classic distribution pattern.',
    confidence: 83,
    sources: ['Insider Sell', 'Institutional Outflow'],
    date: '2024-01-22',
  },
  {
    id: 's5',
    ticker: 'INTC',
    type: 'Strong Sell',
    title: 'Heavy Institutional Exit',
    description: 'Institutional net outflow of $840M. No insider buying support. Downtrend confirmed. Avoid or reduce exposure.',
    confidence: 77,
    sources: ['Institutional Outflow', 'Price Downtrend'],
    date: '2024-01-22',
  },
  {
    id: 's6',
    ticker: 'AMD',
    type: 'Accumulation',
    title: 'Emerging Accumulation',
    description: 'Institutional inflow of $540M in a tight sideways range suggests accumulation before potential breakout.',
    confidence: 66,
    sources: ['Institutional Inflow', 'Price Sideways'],
    date: '2024-01-21',
  },
];

// ─── Smart Money Score Table ──────────────────────────────────────────────
export const mockScoreTable: SmartMoneyScore[] = [
  { ticker: 'NVDA',  name: 'NVIDIA Corp',        score: 91, grade: 'A', insiderScore: 95, institutionalScore: 94, cotScore: 78, priceScore: 88, trend: 'Bullish',  signal: 'Strong Buy'          },
  { ticker: 'MSFT',  name: 'Microsoft Corp',      score: 82, grade: 'A', insiderScore: 84, institutionalScore: 87, cotScore: 71, priceScore: 80, trend: 'Bullish',  signal: 'Accumulation'        },
  { ticker: 'META',  name: 'Meta Platforms',      score: 76, grade: 'B', insiderScore: 80, institutionalScore: 82, cotScore: 62, priceScore: 74, trend: 'Bullish',  signal: 'Accumulation'        },
  { ticker: 'GOOGL', name: 'Alphabet Inc',        score: 71, grade: 'B', insiderScore: 65, institutionalScore: 78, cotScore: 70, priceScore: 72, trend: 'Bullish',  signal: 'Accumulation'        },
  { ticker: 'AMD',   name: 'Advanced Micro Dev',  score: 66, grade: 'B', insiderScore: 58, institutionalScore: 74, cotScore: 64, priceScore: 62, trend: 'Sideways', signal: 'Accumulation'        },
  { ticker: 'AAPL',  name: 'Apple Inc',           score: 54, grade: 'C', insiderScore: 38, institutionalScore: 61, cotScore: 58, priceScore: 66, trend: 'Sideways', signal: 'Neutral'             },
  { ticker: 'DIS',   name: 'Walt Disney Co',      score: 34, grade: 'D', insiderScore: 32, institutionalScore: 28, cotScore: 44, priceScore: 38, trend: 'Bearish',  signal: 'Distribution Warning'},
  { ticker: 'PYPL',  name: 'PayPal Holdings',     score: 28, grade: 'D', insiderScore: 24, institutionalScore: 22, cotScore: 38, priceScore: 30, trend: 'Bearish',  signal: 'Distribution Warning'},
  { ticker: 'TSLA',  name: 'Tesla Inc',           score: 22, grade: 'F', insiderScore: 18, institutionalScore: 16, cotScore: 32, priceScore: 26, trend: 'Bearish',  signal: 'Strong Sell'         },
  { ticker: 'INTC',  name: 'Intel Corp',          score: 16, grade: 'F', insiderScore: 14, institutionalScore: 12, cotScore: 24, priceScore: 18, trend: 'Bearish',  signal: 'Strong Sell'         },
];

// ─── Top Movers ───────────────────────────────────────────────────────────
export const mockTopGainers: TopMover[] = [
  { ticker: 'NVDA',  name: 'NVIDIA Corp',       price: 485.20, changePct:  8.42, volume: 48_200_000, volumeRatio: 2.84 },
  { ticker: 'META',  name: 'Meta Platforms',    price: 392.50, changePct:  5.18, volume: 22_100_000, volumeRatio: 1.97 },
  { ticker: 'AMD',   name: 'Advanced Micro Dev',price: 178.40, changePct:  4.62, volume: 31_400_000, volumeRatio: 1.74 },
  { ticker: 'GOOGL', name: 'Alphabet Inc',      price: 162.30, changePct:  3.74, volume: 28_600_000, volumeRatio: 1.62 },
  { ticker: 'MSFT',  name: 'Microsoft Corp',    price: 408.10, changePct:  2.91, volume: 24_800_000, volumeRatio: 1.48 },
];

export const mockTopLosers: TopMover[] = [
  { ticker: 'TSLA',  name: 'Tesla Inc',         price: 218.80, changePct: -5.34, volume: 94_200_000, volumeRatio: 2.31 },
  { ticker: 'INTC',  name: 'Intel Corp',        price:  44.10, changePct: -4.18, volume: 52_400_000, volumeRatio: 2.14 },
  { ticker: 'PYPL',  name: 'PayPal Holdings',   price:  62.40, changePct: -3.62, volume: 18_700_000, volumeRatio: 1.88 },
  { ticker: 'PFE',   name: 'Pfizer Inc',        price:  27.80, changePct: -2.94, volume: 38_100_000, volumeRatio: 1.64 },
  { ticker: 'DIS',   name: 'Walt Disney Co',    price:  97.20, changePct: -2.47, volume: 16_400_000, volumeRatio: 1.41 },
];

export const mockVolumeBreakouts: TopMover[] = [
  { ticker: 'NVDA',  name: 'NVIDIA Corp',       price: 485.20, changePct:  8.42, volume: 48_200_000, volumeRatio: 2.84 },
  { ticker: 'TSLA',  name: 'Tesla Inc',         price: 218.80, changePct: -5.34, volume: 94_200_000, volumeRatio: 2.31 },
  { ticker: 'INTC',  name: 'Intel Corp',        price:  44.10, changePct: -4.18, volume: 52_400_000, volumeRatio: 2.14 },
  { ticker: 'META',  name: 'Meta Platforms',    price: 392.50, changePct:  5.18, volume: 22_100_000, volumeRatio: 1.97 },
  { ticker: 'AAPL',  name: 'Apple Inc',         price: 194.50, changePct:  1.12, volume: 68_300_000, volumeRatio: 1.92 },
];