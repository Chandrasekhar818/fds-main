"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import { PriceRow } from "@/app/actions/price";

export default function PriceCandlestick({
  data,
}: {
  data: PriceRow[];
}) {
  if (!data.length) {
    return (
      <div className="bg-white p-6 rounded shadow text-gray-500">
        No price data available
      </div>
    );
  }

  const dates = data.map(d => d.date);
  const ohlc = data.map(d => [
    d.open,
    d.close,
    d.low,
    d.high,
  ]);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
    },

    grid: {
      left: 10,
      right: 10,
      top: 30,
      bottom: 30,
      containLabel: true,
    },

    xAxis: {
      type: "category",
      data: dates,
      scale: true,
      boundaryGap: true,
      axisLine: { onZero: false },
    },

    yAxis: {
      scale: true,
    },

    series: [
      {
        type: "candlestick",
        data: ohlc,
        itemStyle: {
          color: "#16a34a",
          color0: "#dc2626",
          borderColor: "#16a34a",
          borderColor0: "#dc2626",
        },
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-sm font-semibold mb-2">
        Price (Candlestick)
      </h2>
      <ReactECharts option={option} style={{ height: 420 }} />
    </div>
  );
}
