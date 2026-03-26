import { PriceTrend, SignalType, CotBias, ScoreGrade } from '@/types/dashboard';

export function fmtCurrency(n: number, decimals = 0): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000)     return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000)         return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  return `${sign}$${abs.toFixed(decimals)}`;
}

export function fmtNumber(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000)     return `${sign}${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${abs}`;
}

export function fmtPct(n: number, signed = false): string {
  const prefix = signed && n > 0 ? '+' : '';
  return `${prefix}${n.toFixed(2)}%`;
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function fmtShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });
}

// ─── Color helpers ────────────────────────────────────────────────────────
export function trendColor(t: PriceTrend): string {
  if (t === 'Bullish')  return 'text-[#34d399]';
  if (t === 'Bearish')  return 'text-[#f87171]';
  return 'text-[#9ca3af]';
}

export function trendBg(t: PriceTrend): string {
  if (t === 'Bullish')  return 'bg-[#34d399]/10 text-[#34d399]';
  if (t === 'Bearish')  return 'bg-[#f87171]/10 text-[#f87171]';
  return 'bg-[#6b7280]/10 text-[#9ca3af]';
}

export function flowColor(n: number): string {
  return n >= 0 ? 'text-[#34d399]' : 'text-[#f87171]';
}

export function signalColor(s: SignalType): string {
  if (s === 'Strong Buy')           return 'text-[#34d399]';
  if (s === 'Accumulation')         return 'text-[#6ee7b7]';
  if (s === 'Neutral')              return 'text-[#9ca3af]';
  if (s === 'Distribution Warning') return 'text-[#fbbf24]';
  if (s === 'Strong Sell')          return 'text-[#f87171]';
  return 'text-[#9ca3af]';
}

export function signalBorder(s: SignalType): string {
  if (s === 'Strong Buy')           return 'border-[#34d399]/30';
  if (s === 'Accumulation')         return 'border-[#6ee7b7]/25';
  if (s === 'Neutral')              return 'border-[#1a1c20]';
  if (s === 'Distribution Warning') return 'border-[#fbbf24]/30';
  if (s === 'Strong Sell')          return 'border-[#f87171]/30';
  return 'border-[#1a1c20]';
}

export function signalBg(s: SignalType): string {
  if (s === 'Strong Buy')           return 'bg-[#34d399]/5';
  if (s === 'Accumulation')         return 'bg-[#6ee7b7]/5';
  if (s === 'Distribution Warning') return 'bg-[#fbbf24]/5';
  if (s === 'Strong Sell')          return 'bg-[#f87171]/5';
  return '';
}

export function signalDot(s: SignalType): string {
  if (s === 'Strong Buy')           return 'bg-[#34d399]';
  if (s === 'Accumulation')         return 'bg-[#6ee7b7]';
  if (s === 'Neutral')              return 'bg-[#6b7280]';
  if (s === 'Distribution Warning') return 'bg-[#fbbf24]';
  if (s === 'Strong Sell')          return 'bg-[#f87171]';
  return 'bg-[#6b7280]';
}

export function cotBiasColor(b: CotBias): string {
  if (b === 'Bullish') return 'bg-green-100 text-green-700';
  if (b === 'Bearish') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-600';
}

export function gradeColor(g: ScoreGrade): string {
  if (g === 'A') return 'text-[#34d399]';
  if (g === 'B') return 'text-[#6ee7b7]';
  if (g === 'C') return 'text-[#fbbf24]';
  if (g === 'D') return 'text-[#fca5a5]';
  return 'text-[#f87171]';
}

export function scoreBarColor(score: number): string {
  if (score >= 75) return 'bg-[#34d399]';
  if (score >= 55) return 'bg-[#6ee7b7]';
  if (score >= 40) return 'bg-[#fbbf24]';
  if (score >= 25) return 'bg-[#fca5a5]';
  return 'bg-[#f87171]';
}