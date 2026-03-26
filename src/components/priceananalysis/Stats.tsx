"use client";

import React from "react";

const trendConfig: Record<
  string,
  {
    arrow: string;
    color: string;
    bg: string;
    meaning: string;
  }
> = {
  Bullish: {
    arrow: "↑",
    color: "text-green-700",
    bg: "bg-green-100",
    meaning: "Price is increasing. Buyers are in control.",
  },
  Bearish: {
    arrow: "↓",
    color: "text-red-700",
    bg: "bg-red-100",
    meaning: "Price is decreasing. Sellers are in control.",
  },
  Sideways: {
    arrow: "→",
    color: "text-gray-700",
    bg: "bg-gray-200",
    meaning: "Price is stable. No strong trend.",
  },
};

interface StatProps {
  label: string;
  value: string;
  tooltip?: string;
}

export default function Stat({ label, value, tooltip }: StatProps) {
  const trend = trendConfig[value];

  return (
    <div className="relative bg-white rounded-xl p-4 shadow-sm group cursor-pointer">

      <p className="text-xs text-gray-500 uppercase">
        {label}
      </p>

      <p
        className={`
          inline-flex items-center gap-1
          px-3 py-1 rounded-full text-sm font-semibold mt-2
          ${trend ? `${trend.bg} ${trend.color}` : "text-gray-900"}
        `}
      >
        {trend && <span>{trend.arrow}</span>}
        {value}
      </p>

      {(tooltip || trend) && (
        <div
          className="
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          opacity-0 group-hover:opacity-100
          scale-95 group-hover:scale-100
          transition-all duration-200
          bg-gray-900 text-white text-xs
          px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50
        "
        >
          {trend ? (
            <div className="flex flex-col gap-1">
              <span className="font-semibold">
                {value} {trend.arrow}
              </span>
              <span className="text-gray-300">
                {trend.meaning}
              </span>
            </div>
          ) : (
            tooltip
          )}

          <div
            className="
            absolute top-full left-1/2 -translate-x-1/2
            border-4 border-transparent border-t-gray-900
          "
          />
        </div>
      )}
    </div>
  );
}
