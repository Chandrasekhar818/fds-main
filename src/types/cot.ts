export interface CotRow {
  market: string;
  report_date: string;
  commercial_long: number;
  commercial_short: number;
  commercial_net: number;
  speculator_long: number;
  speculator_short: number;
  speculator_net: number;
  open_interest: number;
}

export interface CotKPIs {
  commercial_net: number;
  speculator_net: number;
  open_interest: number;
  weekly_change_pct: number;
}

export type SignalStrength = 'Extremely Bullish' | 'Bullish' | 'Neutral' | 'Bearish' | 'Extremely Bearish';

export interface CotSignal {
  actor: 'Commercials' | 'Speculators';
  signal: SignalStrength;
  net_position: number;
  percentile: number;
}


export type DateRangeKey = '30d' | '60d' | '6m' | '1y';

export interface DateRangeOptions {
  value: DateRangeKey;
  label: string;
}
