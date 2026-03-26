"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import { InstitutionalHolding } from "@/app/actions/holdings";

export default function AccumulationLine({
  data,
}: {
  data: InstitutionalHolding[];
}) {
  const byQuarter = data.reduce<Record<string, number>>((acc, row) => {
    acc[row.quarter] = (acc[row.quarter] || 0) + row.value;
    return acc;
  }, {});

  const quarters = Object.keys(byQuarter).sort();
  const values = quarters.map((q) => byQuarter[q]);

  const option = {
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: quarters },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (v: number) => `$${(v / 1e9).toFixed(1)}B`,
      },
    },
    series: [
      {
        type: "line",
        data: values,
        smooth: true,
        lineStyle: { width: 3 },
        areaStyle: { opacity: 0.15 },
        itemStyle: { color: "#2563eb" },
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-sm font-semibold mb-3">
        Institutional Accumulation (Quarterly)
      </h2>
      <ReactECharts option={option} style={{ height: 300 }} />
    </div>
  );
}
