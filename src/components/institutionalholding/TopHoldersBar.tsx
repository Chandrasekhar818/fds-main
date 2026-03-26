"use client";

import React, { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { InstitutionalHolding } from "@/app/actions/holdings";

export default function TopHoldersBar({
  data,
}: {
  data: InstitutionalHolding[];
}) {
  const quarters = useMemo(() => {
    return Array.from(new Set(data.map((d) => d.quarter)))
      .filter(Boolean)
      .sort()
      .reverse();
  }, [data]);

  const [selectedQuarter, setSelectedQuarter] = useState(quarters[0] || "");

  const top10 = useMemo(() => {
    if (!selectedQuarter || !data.length) return [];

    const quarterData = data.filter((d) => d.quarter === selectedQuarter);

    const map = new Map<string, InstitutionalHolding>();
    for (const row of quarterData) {
      const key = `${row.fund_name}-${row.ticker}`;
      const existing = map.get(key);
      if (
        !existing ||
        new Date(row.reported_date) > new Date(existing.reported_date)
      ) {
        map.set(key, row);
      }
    }

    return Array.from(map.values())
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [data, selectedQuarter]);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      confine: true,
      formatter: (params: any) => {
        if (!top10[params[0]?.dataIndex]) return "";
        const d = top10[params[0].dataIndex];
        return `
          <div class="text-left">
            <strong>${d.fund_name}</strong><br/>
            Value: $${d.value.toLocaleString()}<br/>
            Shares: ${d.shares.toLocaleString()}<br/>
            Weight: ${d.weight.toFixed(2)}%
          </div>
        `;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      top: "8%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: top10.map((d) => d.fund_name),
      axisLabel: {
        rotate: 45,
        interval: 0,
        fontSize: 11,
        margin: 12,
      },
      axisTick: { alignWithLabel: true },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: 11,
        formatter: (v: number) =>
          v >= 1e9
            ? `$${(v / 1e9).toFixed(1)}B`
            : v >= 1e6
            ? `$${(v / 1e6).toFixed(0)}M`
            : `$${v.toLocaleString()}`,
      },
    },
    series: [
      {
        type: "bar",
        data: top10.map((d) => d.value),
        itemStyle: { color: "#16a34a" },
        barMaxWidth: 60,
        label: {
          show: true,
          position: "top",
          fontSize: 11,
          color: "#374151",
          formatter: (params: any) => {
            const v = params.value;
            if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
            if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`;
            return `$${v.toLocaleString()}`;
          },
        },
      },
    ],
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          Top 10 Institutional Holders
        </h2>
        {quarters.length > 0 && (
          <select
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 min-w-[140px]"
          >
            {quarters.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        )}
      </div>

      {top10.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
          No data available for selected quarter
        </div>
      ) : (
        <ReactECharts
          option={option}
          style={{ height: "320px", width: "100%" }}
          notMerge={true}
          lazyUpdate={true}
        />
      )}
    </div>
  );
}