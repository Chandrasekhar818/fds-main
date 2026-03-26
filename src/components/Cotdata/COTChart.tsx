"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

const LOOKBACK_OPTIONS = [
  { label: "1M", value: 4 },
  { label: "3M", value: 12 },
  { label: "6M", value: 26 },
  { label: "1Y", value: 52 },
];

type COTRow = {
  report_date: string;
  commercial_long: number | null;
  commercial_short: number | null;
  non_commercial_long: number | null;
  non_commercial_short: number | null;
  non_reportable_long: number | null;
  non_reportable_short: number | null;
};

export default function COTChart({ data }: { data: COTRow[] }) {
  const [lookback, setLookback] = useState(12);

  const processedData = useMemo(() => {
    if (!data?.length) return [];

    return data.map((row) => ({
      report_date: row.report_date,
      commercial_net:
        (row.commercial_long ?? 0) -
        (row.commercial_short ?? 0),
      non_commercial_net:
        (row.non_commercial_long ?? 0) -
        (row.non_commercial_short ?? 0),
      non_reportable_net:
        (row.non_reportable_long ?? 0) -
        (row.non_reportable_short ?? 0),
    }));
  }, [data]);

  const filteredData = useMemo(() => {
    return processedData.slice(-lookback);
  }, [processedData, lookback]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-sm sm:text-base font-semibold text-gray-900">
          Net Position Trends
        </h2>

        <div className="flex flex-wrap gap-2">
          {LOOKBACK_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setLookback(opt.value)}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-md font-medium transition-all
                ${
                  lookback === opt.value
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[280px] sm:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid
              stroke="#e5e7eb"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="report_date"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <YAxis
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickFormatter={(v) =>
                Math.abs(v) >= 1_000_000
                  ? `${(v / 1_000_000).toFixed(1)}M`
                  : Math.abs(v) >= 1_000
                  ? `${(v / 1_000).toFixed(0)}K`
                  : v
              }
            />

            <ReferenceLine y={0} stroke="#d1d5db" />

            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />

            <Legend
              wrapperStyle={{ fontSize: "12px" }}
            />

            <Line
              type="monotone"
              dataKey="commercial_net"
              name="Commercial"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="non_commercial_net"
              name="Non-Commercial"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="non_reportable_net"
              name="Non-Reportable"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
