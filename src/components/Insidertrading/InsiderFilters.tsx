"use client";

import { useState } from "react";
import type { InsiderTradeFilters } from "@/app/actions/insider-trades";

export default function InsiderFilters({
  onApply,
}: {
  onApply: (filters: InsiderTradeFilters) => void;
}) {
  const [ticker, setTicker] = useState("");
  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap gap-3">
      <input
        className="border px-3 py-2 rounded text-sm w-36"
        placeholder="Ticker (AAPL)"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
      />

      <select
        className="border px-3 py-2 rounded text-sm"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="">All Transactions</option>
        <option value="P">Buy</option>
        <option value="S">Sell</option>
        <option value="PS">Proposed</option>
      </select>

      <input
        type="date"
        className="border px-3 py-2 rounded text-sm"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />

      <input
        type="date"
        className="border px-3 py-2 rounded text-sm"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />

      <button
        onClick={() =>
          onApply({ ticker, type, fromDate, toDate })
        }
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
      >
        Apply Filters
      </button>
    </div>
  );
}
