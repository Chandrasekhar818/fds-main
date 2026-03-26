// ─── Price Data ────────────────────────────────────────────────────────────
export type PriceTrend = 'Bullish' | 'Bearish' | 'Sideways';

export interface PriceSnapshot {
  ticker: string;
  name: string;
  price: number;
  change: number;       // absolute
  changePct: number;    // percentage
  volume: number;
  avgVolume: number;
  trend: PriceTrend;
  trendStrength: number; // 0–100
}

// ─── Insider Trades ────────────────────────────────────────────────────────
export type InsiderRole = 'CEO' | 'CFO' | 'Director' | 'Officer' | 'Chairman';
export type TradeType   = 'Buy' | 'Sell';

export interface InsiderTrade {
  id: string;
  ticker: string;
  insiderName: string;
  role: InsiderRole;
  type: TradeType;
  shares: number;
  price: number;
  totalValue: number;
  date: string;
}

export interface InsiderSummary {
  totalBuyValue: number;
  totalSellValue: number;
  netFlow: number;
  topTrades: InsiderTrade[];
}

// ─── Institutional Trades ──────────────────────────────────────────────────
export interface InstitutionalFlow {
  ticker: string;
  name: string;
  netFlow: number;       // positive = buy, negative = sell
  buyValue: number;
  sellValue: number;
  institutions: number;  // number of institutions involved
}

export interface InstitutionalSummary {
  totalNetFlow: number;
  topAccumulated: InstitutionalFlow[];
  topDistributed: InstitutionalFlow[];
}

// ─── COT Data ──────────────────────────────────────────────────────────────
export type CotBias = 'Bullish' | 'Bearish' | 'Neutral';

export interface CotSnapshot {
  market: string;
  report_date: string;
  commercial_net: number;
  speculator_net: number;
  open_interest: number;
  bias: CotBias;
  biasStrength: number;  // 0–100 percentile
}

// ─── Smart Money Score ─────────────────────────────────────────────────────
export type ScoreGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface SmartMoneyScore {
  ticker: string;
  name: string;
  score: number;          // 0–100
  grade: ScoreGrade;
  insiderScore: number;   // component 0–100
  institutionalScore: number;
  cotScore: number;
  priceScore: number;
  trend: PriceTrend;
  signal: SignalType;
}

// ─── Signals ───────────────────────────────────────────────────────────────
export type SignalType =
  | 'Strong Buy'
  | 'Accumulation'
  | 'Neutral'
  | 'Distribution Warning'
  | 'Strong Sell';

export interface SmartMoneySignal {
  id: string;
  ticker: string;
  type: SignalType;
  title: string;
  description: string;
  confidence: number;     // 0–100
  sources: string[];      // which datasets triggered this
  date: string;
}

// ─── Market Direction ──────────────────────────────────────────────────────
export interface MarketDirectionSummary {
  overallTrend: PriceTrend;
  trendStrength: number;
  institutionalNetFlow: number;
  insiderSentiment: 'Bullish' | 'Bearish' | 'Neutral';
  insiderNetFlow: number;
  cotBias: CotBias;
  cotStrength: number;
  lastUpdated: string;
}

// ─── Top Movers ────────────────────────────────────────────────────────────
export interface TopMover {
  ticker: string;
  name: string;
  price: number;
  changePct: number;
  volume: number;
  volumeRatio: number;    // vs avg volume
}


export interface SmartMoneyDashboardResponse {
  marketDirection: MarketDirectionSummary;
  insiderSummary: InsiderSummary;
  institutionalSummary: InstitutionalSummary;
  cotSnapshots: CotSnapshot[];
  topMovers: {
    topGainers: TopMover[];
    topLosers: TopMover[];
    volumeBreakouts: TopMover[];
  };
  scoreTable: SmartMoneyScore[];
  signals: SmartMoneySignal[];
}