import { signalColor, trendBg } from '@/lib/utils/dashboardUtils';
import { PriceTrend, SignalType } from '@/types/dashboard';


interface SectionProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
export function Section({ title, subtitle, action, children, className = '' }: SectionProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}


export function TrendBadge({ trend }: { trend: PriceTrend }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md ${trendBg(trend)}`}>
      {trend === 'Bullish' ? '▲' : trend === 'Bearish' ? '▼' : '—'}&nbsp;{trend}
    </span>
  );
}


export function SignalBadge({ signal }: { signal: SignalType }) {
  return (
    <span className={`text-xs font-medium ${signalColor(signal)}`}>
      {signal}
    </span>
  );
}


interface MiniBarProps { value: number; color?: string }
export function MiniBar({ value, color = 'bg-green-500' }: MiniBarProps) {
  return (
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-16 border border-gray-200">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}


export function Divider() {
  return <div className="border-t border-gray-200 my-5" />;
}


interface DataRowProps {
  label: string;
  value: React.ReactNode;
  sub?: string;
}
export function DataRow({ label, value, sub }: DataRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="text-right">
        <span className="text-sm text-gray-900 font-medium tabular-nums">{value}</span>
        {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}


export function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 80 ? 'bg-green-500'
    : value >= 60 ? 'bg-yellow-400'
    : 'bg-red-400';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-gray-600 tabular-nums w-10 text-right">
        {value}%
      </span>
    </div>
  );
}


export function SourceTags({ sources }: { sources: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {sources.map(s => (
        <span
          key={s}
          className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-md border border-gray-200"
        >
          {s}
        </span>
      ))}
    </div>
  );
}


export function TickerChip({ ticker }: { ticker: string }) {
  return (
    <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-md border border-gray-200 min-w-[44px] text-center tracking-wide">
      {ticker}
    </span>
  );
}
