import { CotSignal, SignalStrength } from '@/types/cot';

interface Props { signals: CotSignal[] }

function signalColor(s: SignalStrength): string {
  if (s === 'Extremely Bullish') return 'text-emerald-600';
  if (s === 'Bullish')           return 'text-emerald-500';
  if (s === 'Neutral')           return 'text-gray-500';
  if (s === 'Bearish')           return 'text-red-400';
  return 'text-red-600';
}

function barColor(s: SignalStrength): string {
  if (s === 'Extremely Bullish') return 'bg-emerald-600';
  if (s === 'Bullish')           return 'bg-emerald-400';
  if (s === 'Neutral')           return 'bg-gray-400';
  if (s === 'Bearish')           return 'bg-red-400';
  return 'bg-red-600';
}

function percentileWidth(p: number): string {
  return `${Math.min(100, Math.max(0, p))}%`;
}

function fmtNet(n: number): string {
  const abs = Math.abs(n);
  const prefix = n >= 0 ? '+' : '−';
  if (abs >= 1_000_000) return `${prefix}${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000)     return `${prefix}${(abs / 1_000).toFixed(1)}K`;
  return `${prefix}${abs}`;
}

interface SignalCardProps { signal: CotSignal }

function SignalCard({ signal }: SignalCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">

      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

        <div>
          <p className="text-[11px] tracking-widest uppercase text-gray-500 font-semibold mb-1">
            {signal.actor}
          </p>

          <p className={`text-base sm:text-lg font-semibold ${signalColor(signal.signal)}`}>
            {signal.signal}
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-[11px] text-gray-500 mb-1 font-medium">
            Net Position
          </p>

          <p className="text-sm sm:text-base font-semibold text-gray-900 tabular-nums">
            {fmtNet(signal.net_position)}
          </p>
        </div>
      </div>

      {/* Percentile Bar */}
      <div className="mt-5">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Percentile Rank</span>
          <span className="tabular-nums font-medium text-gray-700">
            {signal.percentile.toFixed(0)}th
          </span>
        </div>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor(signal.signal)}`}
            style={{ width: percentileWidth(signal.percentile) }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-gray-400 mt-2">
          <span>Bearish Extreme</span>
          <span>Bullish Extreme</span>
        </div>
      </div>
    </div>
  );
}

export function CotSignalsPanel({ signals }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
      {signals.map(s => (
        <SignalCard key={s.actor} signal={s} />
      ))}
    </div>
  );
}
