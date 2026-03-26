'use client';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { CotRow } from '@/types/cot';

interface Props { data: CotRow[] }

function fmtTick(n: number) {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function fmtDate(s: string) {
  const d = new Date(s);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="text-gray-500 mb-2 font-medium">{fmtDate(label)}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-6 mb-1">
          <span style={{ color: p.color }} className="font-medium">
            {p.name}
          </span>
          <span className="text-gray-800 tabular-nums">
            {fmtTick(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex flex-wrap gap-4 justify-center mt-3">
      {payload.map((p: any) => (
        <div key={p.value} className="flex items-center gap-2">
          <span
            className="w-4 h-[2px] rounded"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-xs text-gray-600">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export function PositioningChart({ data }: Props) {
  const chartData = data.map(r => ({
    date: r.report_date,
    'Commercial Long': r.commercial_long,
    'Commercial Short': r.commercial_short,
    'Speculator Long': r.speculator_long,
    'Speculator Short': r.speculator_short,
  }));

  const step = Math.max(1, Math.floor(chartData.length / 6));

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
      <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">
        Gross Positioning — Long vs Short
      </h2>

      <div className="h-[300px] sm:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gCommL" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gCommS" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gSpecL" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gSpecS" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tickFormatter={fmtDate}
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
              interval={step - 1}
            />

            <YAxis
              tickFormatter={fmtTick}
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={50}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />

            <Area
              type="monotone"
              dataKey="Commercial Long"
              stroke="#10b981"
              strokeWidth={1.5}
              fill="url(#gCommL)"
              dot={false}
            />

            <Area
              type="monotone"
              dataKey="Commercial Short"
              stroke="#ef4444"
              strokeWidth={1.5}
              fill="url(#gCommS)"
              dot={false}
            />

            <Area
              type="monotone"
              dataKey="Speculator Long"
              stroke="#3b82f6"
              strokeWidth={1.5}
              fill="url(#gSpecL)"
              dot={false}
            />

            <Area
              type="monotone"
              dataKey="Speculator Short"
              stroke="#f59e0b"
              strokeWidth={1.5}
              fill="url(#gSpecS)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
