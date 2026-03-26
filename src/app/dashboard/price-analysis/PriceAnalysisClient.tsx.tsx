"use client";

import { useState, useEffect} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PriceCandlestick from "@/components/priceananalysis/PriceCandlestick";
import PriceHeader from "@/components/priceananalysis/PriceHeader";
import SemiCircleGauge from "@/components/priceananalysis/SemiCircleGauge";
import Section from "@/components/priceananalysis/Section";
import Stat from "@/components/priceananalysis/Stats";
import { getDateRange, DateRangeOption } from "@/lib/utils/date-range";
import { fetchPriceData, PriceRow } from "@/app/actions/price";
import { fetchUserCompanyOptions } from "@/app/actions/insider-analytics";
import { ImportPriceModal } from "@/components/priceananalysis/ImportPriceModal";
import { importPriceCSV } from "@/app/actions/importPriceCSv";

export default function PriceAnalysisPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [companyOptions, setCompanyOptions] = useState<{ ticker: string; name: string }[]>([]);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>("2y");
  const [priceData, setPriceData] = useState<PriceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [openImport, setOpenImport] = useState(false);

  // Load company options
  useEffect(() => {
    const loadCompanies = async () => {
      const result = await fetchUserCompanyOptions();
      setCompanyOptions(result ?? []);
      if (result?.length > 0 && !selectedTicker) {
        setSelectedTicker(result[0].ticker);
      }
    };
    loadCompanies();
  }, [selectedTicker]);

  // Sync ticker and range with URL
  useEffect(() => {
    const tickerFromURL = searchParams.get("ticker");
    const rangeFromURL = searchParams.get("range") as DateRangeOption | null;

    if (tickerFromURL) setSelectedTicker(tickerFromURL);
    if (rangeFromURL) setSelectedRange(rangeFromURL);
  }, [searchParams]);

  // Fetch price data
  useEffect(() => {
    if (!selectedTicker) return;

    const loadPriceData = async () => {
      setLoading(true);
      const { fromDate, toDate } = getDateRange(selectedRange);

      const data = await fetchPriceData({
        ticker: selectedTicker,
        fromDate,
        toDate,
        limit: 1000,
      });

      // Sort by date ascending
      const sorted = [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setPriceData(sorted);
      setLoading(false);
    };

    loadPriceData();
  }, [selectedTicker, selectedRange]);

  // Handle company change
  const handleCompanyChange = (ticker: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("ticker", ticker);

    router.push(`?${params.toString()}`);
    router.refresh();
  };

  // Handle range change
  const handleRangeChange = (range: DateRangeOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);

    router.push(`?${params.toString()}`, { scroll: false });
    router.refresh();
  };

  // Handle CSV upload
  const handleFileUpload = async (file: File) => {
    try {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        alert("Only CSV files are allowed.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File too large. Max allowed size is 5MB.");
        return;
      }

      const result = await importPriceCSV(file);

      if (!result.success) {
        alert(`Import failed:\n${result.errors?.join("\n")}`);
      } else {
        alert(
          `Import successful!\nInserted: ${result.inserted}\nSkipped: ${result.skipped}\nNew Companies: ${result.newCompanies}`
        );
      }

      setOpenImport(false);
      // Refresh data for current ticker
      if (selectedTicker) {
        const { fromDate, toDate } = getDateRange(selectedRange);
        const refreshed = await fetchPriceData({
          ticker: selectedTicker,
          fromDate,
          toDate,
          limit: 1000,
        });

        setPriceData(refreshed);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Import failed: ${err?.message || "Something went wrong"}`);
    }
  };

  if (!companyOptions.length) {
    return (
      <div className="p-10 text-center text-gray-500">
        No companies found. Please upload price data first.
      </div>
    );
  }

  if (!selectedTicker || loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading price data...
      </div>
    );
  }

  const sorted = [...priceData];

  return (
    <div className="min-h-screen bg-white">
      <PriceHeader
        companies={companyOptions}
        selectedTicker={selectedTicker}
        selectedRange={selectedRange}
        existing_companys={companyOptions}
        onUpload={() => setOpenImport(true)}
      />

      <ImportPriceModal
        open={openImport}
        onClose={() => setOpenImport(false)}
        onUpload={handleFileUpload}
        existing_companys={companyOptions}
      />

      <div className="max-w-[1600px] mx-auto px-8 py-8 space-y-12">
        {sorted.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No data available for {selectedTicker}
          </div>
        ) : (
          <>
            {/* Candlestick Chart */}
            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 uppercase tracking-wide mb-6">
                {selectedTicker}
              </h3>
              <PriceCandlestick data={sorted} />
            </div>

            {/* Price Overview */}
            {/* Price Overview */}
            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex flex-col space-y-4 w-full md:w-1/3">
                <h3 className="text-md font-semibold text-gray-800 uppercase tracking-wide">
                  Price Overview
                </h3>

                {/** Compute high and low with date */}
                {(() => {
                  const highData = sorted.reduce((prev, curr) =>
                    curr.high > prev.high ? curr : prev
                  );
                  const lowData = sorted.reduce((prev, curr) =>
                    curr.low < prev.low ? curr : prev
                  );
                  const avgClose =
                    sorted.reduce((sum, d) => sum + d.close, 0) / sorted.length;

                  return (
                    <>
                      <Stat
                        label="Period High"
                        value={`₹${highData.high.toFixed(2)}`}
                        tooltip={`Highest price on ${new Date(
                          highData.date
                        ).toLocaleDateString()}`}
                      />
                      <Stat
                        label="Average Close"
                        value={`₹${avgClose.toFixed(2)}`}
                        tooltip="Average closing price"
                      />
                      <Stat
                        label="Period Low"
                        value={`₹${lowData.low.toFixed(2)}`}
                        tooltip={`Lowest price on ${new Date(
                          lowData.date
                        ).toLocaleDateString()}`}
                      />
                    </>
                  );
                })()}
              </div>

              <div className="w-full md:w-2/3 flex justify-center">
                <SemiCircleGauge
                  min={Math.min(...sorted.map((d) => d.low))}
                  max={Math.max(...sorted.map((d) => d.high))}
                  value={sorted[sorted.length - 1].close}
                />
              </div>
            </div>


            {/* Trend Detection */}
            <Section title="Trend Detection">
              <Stat
                label="Trend"
                value={
                  ((sorted[sorted.length - 1].close - sorted[0].close) /
                    sorted[0].close) *
                    100 >
                    1
                    ? "Bullish"
                    : ((sorted[sorted.length - 1].close - sorted[0].close) /
                      sorted[0].close) *
                      100 <
                      -1
                      ? "Bearish"
                      : "Sideways"
                }
                tooltip="Overall market direction"
              />
              <Stat
                label="Price Change"
                value={`${(
                  ((sorted[sorted.length - 1].close - sorted[0].close) /
                    sorted[0].close) *
                  100
                ).toFixed(2)}%`}
                tooltip="Change from first close"
              />
            </Section>

            {/* Volume Analysis */}
            <Section title="Volume Analysis">
              <Stat
                label="Total Volume"
                value={`${(
                  sorted.reduce((sum, d) => sum + d.volume, 0) / 1_000_000
                ).toFixed(2)}M`}
                tooltip="Total traded volume"
              />
              <Stat
                label="Average Volume"
                value={`${(
                  sorted.reduce((sum, d) => sum + d.volume, 0) / sorted.length
                ).toFixed(0)}`}
                tooltip="Average daily volume"
              />
            </Section>

            {/* Volatility */}
            <Section title="Volatility">
              <Stat
                label="Volatility"
                value={`${(
                  ((Math.max(...sorted.map((d) => d.high)) -
                    Math.min(...sorted.map((d) => d.low))) /
                    (sorted.reduce((sum, d) => sum + d.close, 0) /
                      sorted.length)) *
                  100
                ).toFixed(2)}%`}
                tooltip="Price fluctuation level"
              />
            </Section>
          </>
        )}
      </div>
    </div>
  );
}
