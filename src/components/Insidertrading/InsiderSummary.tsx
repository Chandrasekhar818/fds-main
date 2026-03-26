
"use client";

import { useEffect, useState } from "react";
import InsiderFilters from "@/components/Insidertrading/InsiderFilters";
import { fetchInsiderTrades } from "@/app/actions/insider-trades";
import type { InsiderTradeFilters } from "@/app/actions/insider-trades";

export default function InsiderTradingTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async (filters: InsiderTradeFilters = {}) => {
    setLoading(true);
    const result = await fetchInsiderTrades(filters);
    setData(result ?? []);
    setLoading(false);
  };

  // initial load
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-4">
      <InsiderFilters onApply={loadData} />

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-3 py-2 text-left">Ticker</th>
              <th className="px-3 py-2 text-left">Insider</th>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-center">Date</th>
              <th className="px-3 py-2 text-center">Transaction</th>
              <th className="px-3 py-2 text-right">Price</th>
              <th className="px-3 py-2 text-right">Shares</th>
              <th className="px-3 py-2 text-right">Value ($)</th>
              <th className="px-3 py-2 text-center">Ownership</th>
              <th className="px-3 py-2 text-center">Filed</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="py-6 text-center text-gray-500">
                  Loading insider trades…
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-6 text-center text-gray-500">
                  No insider trades found
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-semibold text-blue-600">
                    {row.ticker ?? "-"}
                  </td>
                  <td className="px-3 py-2">{row.insider_name ?? "-"}</td>
                  <td className="px-3 py-2">{row.insider_title ?? "-"}</td>
                  <td className="px-3 py-2 text-center">
                    {row.transaction_date ?? "-"}
                  </td>
                  <td className="px-3 py-2 text-center font-semibold">
                    {row.transaction_type === "P"
                      ? "Buy"
                      : row.transaction_type === "S"
                      ? "Sell"
                      : "Proposed"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {row.price?.toFixed(2) ?? "-"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {row.shares?.toLocaleString() ?? "-"}
                  </td>
                  <td className="px-3 py-2 text-right font-medium">
                    {row.value?.toLocaleString() ?? "-"}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {row.ownership_type ?? "-"}
                  </td>
                  <td className="px-3 py-2 text-blue-600 hover:underline">
                    {row.filing_date ?? "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
