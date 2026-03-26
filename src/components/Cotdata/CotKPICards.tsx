import { CotKPIs } from '@/types/cot';

interface Props { kpis: CotKPIs }

function fmt(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function sign(n: number) { return n >= 0 ? '+' : ''; }

interface CardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: number;
}

function KpiCard({ label, value, sub, trend }: CardProps) {
  const isPositive = (trend ?? 0) >= 0;

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">

      {/* Accent strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
        isPositive ? 'bg-emerald-500' : 'bg-red-500'
      }`} />

      <p className="text-[11px] tracking-widest uppercase text-gray-500 font-semibold mb-3 pl-3">
        {label}
      </p>

      <div className="flex items-center justify-between pl-3">
        <p className="text-2xl font-semibold text-gray-900 tabular-nums">
          {value}
        </p>

        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {isPositive ? '▲' : '▼'}
            {Math.abs(trend).toFixed(2)}%
          </div>
        )}
      </div>

      {sub && (
        <p className="text-xs text-gray-400 mt-2 pl-3">
          {sub}
        </p>
      )}
    </div>
  );
}

export function CotKPICards({ kpis }: Props) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

      <KpiCard
        label="Commercial Net"
        value={`${sign(kpis.commercial_net)}${fmt(kpis.commercial_net)}`}
        sub="contracts"
        trend={kpis.commercial_net}
      />

      <KpiCard
        label="Speculator Net"
        value={`${sign(kpis.speculator_net)}${fmt(kpis.speculator_net)}`}
        sub="contracts"
        trend={kpis.speculator_net}
      />

      <KpiCard
        label="Open Interest"
        value={fmt(kpis.open_interest)}
        sub="total contracts"
      />

      <KpiCard
        label="Weekly Change"
        value={`${sign(kpis.weekly_change_pct)}${kpis.weekly_change_pct.toFixed(2)}%`}
        sub="open interest"
        trend={kpis.weekly_change_pct}
      />

    </div>
  );
}
