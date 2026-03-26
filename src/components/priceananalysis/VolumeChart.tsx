"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import { PriceRow } from "@/app/actions/price";

export default function VolumeChart({
  data,
}: {
  data: PriceRow[];
}) {
  const option = {
    tooltip: { trigger: "axis" },

    grid: {
      left: 10,
      right: 10,
      top: 20,
      bottom: 30,
      containLabel: true,
    },

    xAxis: {
      type: "category",
      data: data.map(d => d.date),
    },

    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (v: number) => `${(v / 1e6).toFixed(0)}M`,
      },
    },

    series: [
      {
        type: "bar",
        data: data.map(d => d.volume),
        itemStyle: {
          color: "#94a3b8",
        },
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-sm font-semibold mb-2">
        Volume
      </h2>
      <ReactECharts option={option} style={{ height: 180 }} />
    </div>
  );
}
