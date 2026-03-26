"use client";

import { useState, useMemo, useEffect } from "react";
import { MarketSelector } from "./MarketSelector";
import { CotDateRangeFilter } from "./CotDateRangeFilter";
import { PositioningChart } from "./PositioningChart";
import { NetPositionChart } from "./NetPositionChart";
import { CotDataTable } from "./CotDataTable";

import { CotKPIs, CotSignal, DateRangeKey, SignalStrength } from "@/types/cot";

import { CotKPICards } from "./CotKPICards";
import { CotSignalsPanel } from "./CotSignalsPanel";

import { fetchCotReports, fetchMarketOptions } from "@/app/actions/cot";
import { DATE_RANGE_OPTIONS, getCotDateRange } from "@/lib/utils/date-range";
import { importCotCSV } from "@/app/actions/importCotCSV";
import { ImportCotModal } from "./ImportCotModal";
import { deriveKpis, deriveSignals } from "@/lib/utils/cotCalculations";


export function CotDashboardPage() {
  const [market, setMarket] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeKey>("1y");

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [marketOptions, setMarketOptions] = useState<{ market: string }[]>([]);
  const [openImport, setOpenImport] = useState(false);

  useEffect(() => {
    const loadMarkets = async () => {
      const result = await fetchMarketOptions();
      setMarketOptions(result.data ?? []);
      if (result?.data?.length > 0) {
        setMarket(result.data[0].market);
      }
    };
    loadMarkets();
  }, []);
  useEffect(() => {
    if (!market) return;
    const load = async () => {
      setLoading(true);

      const { fromDate, toDate } = getCotDateRange(dateRange);

      const data = await fetchCotReports({
        market,
        fromDate,
        toDate,
      });

      setRows(data.data ?? []);
      setLoading(false);
    };

    load();
  }, [market, dateRange]);

  const kpis = useMemo(() => deriveKpis(rows), [rows]);
  const signals = useMemo(() => deriveSignals(rows), [rows]);

  if (loading) {
    return <div className="p-10 text-gray-400">Loading COT data...</div>;
  }

  const handleUpload = async (file: File) => {
  const result = await importCotCSV(file);

  if (!result.success) {
    alert(result.message);
    return;
  }

  alert(result.message);
  window.location.reload();
};

   return (
  <div className="min-h-screen bg-gray-50 text-gray-900">
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-1 h-5 bg-green-500 rounded-sm" />
              <h1 className="text-lg sm:text-xl font-semibold">
                COT Reports
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Commitment of Traders — Weekly Futures Positioning
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <MarketSelector
              options={marketOptions}
              selected={market}
              onChange={setMarket}
            />
            <CotDateRangeFilter
              options={DATE_RANGE_OPTIONS}
              selected={dateRange}
              onChange={setDateRange}
            />
             <button
  onClick={() => setOpenImport(true)}
  className="px-4 py-2 bg-green-50 text-green-700 text-sm rounded-sm border border-green-200 hover:bg-green-100 transition-colors"
>
  Import COT Data
</button>
<ImportCotModal
  open={openImport}
  onClose={() => setOpenImport(false)}
  onUpload={handleUpload}
  existingMarkets={marketOptions}
/>


          </div>
        </div>
      </div>
    </header>

    <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
        <CotKPICards kpis={kpis} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="border-b border-gray-200 px-4 sm:px-6 py-4">
              <h2 className="text-sm font-semibold text-gray-700">
                Gross Positioning — Long vs Short
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              <PositioningChart data={rows} />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="border-b border-gray-200 px-4 sm:px-6 py-4">
              <h2 className="text-sm font-semibold text-gray-700">
                Net Position Trend
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              <NetPositionChart data={rows} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm h-fit">
          <div className="border-b border-gray-200 px-4 sm:px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-700">
              Positioning Signals
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Based on {rows.length}-week history
            </p>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            <CotSignalsPanel signals={signals} />

            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
                Signal Methodology
              </p>

              {[
                { range: "≥ 90th pct", label: "Extremely Bullish", color: "bg-green-500" },
                { range: "65–89th", label: "Bullish", color: "bg-green-400" },
                { range: "36–64th", label: "Neutral", color: "bg-gray-400" },
                { range: "11–35th", label: "Bearish", color: "bg-red-300" },
                { range: "≤ 10th pct", label: "Extremely Bearish", color: "bg-red-500" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${s.color}`} />
                    <span className="text-xs text-gray-600">
                      {s.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 tabular-nums">
                    {s.range}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="border-b border-gray-200 px-4 sm:px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-700">
            Raw Weekly Data
          </h2>
        </div>
        <div className="p-4 sm:p-6 overflow-x-auto">
          <CotDataTable data={rows} />
        </div>
      </div>

    </main>
  </div>
);

}