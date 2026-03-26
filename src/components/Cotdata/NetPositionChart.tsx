'use client';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { CotRow } from '@/types/cot';

interface Props { data: CotRow[] }

function fmtTick(n: number) {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
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

export function NetPositionChart({ data }: Props) {
  const chartData = data.map(r => ({
    date: r.report_date,
    'Commercial Net': r.commercial_net,
    'Speculator Net': r.speculator_net,
  }));

  const step = Math.max(1, Math.floor(chartData.length / 6));

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
      <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">
        Net Position Trend
      </h2>

      <div className="h-[300px] sm:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
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

            <ReferenceLine y={0} stroke="#d1d5db" strokeWidth={1.5} />

            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />

            <Line
              type="monotone"
              dataKey="Commercial Net"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />

            <Line
              type="monotone"
              dataKey="Speculator Net"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
