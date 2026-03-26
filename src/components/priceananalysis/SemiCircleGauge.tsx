"use client";

import React, { useMemo } from "react";

interface SemiCircleGaugeProps {
  min: number;
  max: number;
  value: number;
  size?: number;
}

export default function SemiCircleGauge({
  min,
  max,
  value,
  size = 360,
}: SemiCircleGaugeProps) {

  const { percentage, clamped } = useMemo(() => {
    const raw =
      max === min ? 0 : (value - min) / (max - min);

    const clampedValue = Math.min(
      Math.max(raw, 0),
      1
    );

    return {
      percentage: clampedValue * 100,
      clamped: clampedValue,
    };
  }, [min, max, value]);

  const strokeWidth = 18;
  const radius = size / 2 - strokeWidth;
  const center = size / 2;

  const angle = Math.PI * clamped;

  const pointerX =
    center - radius * Math.cos(angle);
  const pointerY =
    center - radius * Math.sin(angle);

  const arcPath = `
    M ${center - radius} ${center}
    A ${radius} ${radius} 0 0 1 ${center + radius} ${center}
  `;

  const gradientId = useMemo(
    () =>
      `gaugeGradient-${Math.random()
        .toString(36)
        .substring(2, 9)}`,
    []
  );

  return (
    <div className="flex flex-col items-center w-full">

      {/* Gauge */}
      <div className="relative w-full max-w-[400px]">
        <svg
          width="100%"
          height={size / 2 + 30}
          viewBox={`0 0 ${size} ${size / 2 + 30}`}
        >
          <defs>
            <linearGradient
              id={gradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>

          {/* Background arc */}
          <path
            d={arcPath}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />

          {/* Colored arc */}
          <path
            d={arcPath}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />

          {/* Black dot pointer with tooltip */}
          <circle
            cx={pointerX}
            cy={pointerY}
            r="8"
            fill="black"
            className="cursor-pointer"
          >
            <title>Represents the latest closing price</title>
          </circle>

        </svg>

        {/* Center text */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-2 text-center">

          {/* Price */}
          <p className="text-xl font-semibold text-gray-900">
            ₹{value.toFixed(2)}
          </p>

          {/* Percentage with tooltip */}
          <p
            className="text-xs text-gray-500 cursor-help"
            title="Shows how far the current price lies between the period low and period high"
          >
            {percentage.toFixed(1)}% of range
          </p>

        </div>
      </div>

      {/* Min and Max */}
      <div className="flex justify-between w-full max-w-[400px] text-sm text-gray-600 mt-4">
        <span>₹{min.toFixed(2)}</span>
        <span>₹{max.toFixed(2)}</span>
      </div>

    </div>
  );
}
