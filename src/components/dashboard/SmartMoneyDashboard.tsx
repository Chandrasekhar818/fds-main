"use client";

import { SmartMoneyDashboardResponse } from "@/types/dashboard";
import { CotSummaryPanel } from "./CotSummaryPanel";
import { DashboardHeader } from "./DashboardHeader";
import { InsiderActivityPanel } from "./InsiderActivityPanel";
import { InstitutionalFlowPanel } from "./InstitutionalFlowPanel";
import { MarketDirectionSection } from "./MarketDirectionSection";
import { SmartMoneyScoreTable } from "./SmartMoneyScoreTable";
import { SmartMoneySignalsSection } from "./SmartMoneySignalsSection";
import { TopMoversSection } from "./TopMoversSection";
import { useEffect, useState } from "react";
import { fetchDashboard } from "@/app/actions/getDashboardData";

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[9px] tracking-[0.2em] uppercase font-semibold text-[#4b5563]">
        {label}
      </span>
      <div className="flex-1 h-px bg-[#1a1c20]" />
    </div>
  );
}

export function SmartMoneyDashboard() {
  const [data, setData] = useState<SmartMoneyDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchDashboard();
        setData(res);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <DashboardHeader lastUpdated={data.marketDirection.lastUpdated} />
      </div>

      <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <section>
          <SectionLabel label="Market Direction Summary" />
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <MarketDirectionSection data={data.marketDirection} />
          </div>
        </section>

        <section>
          <SectionLabel label="Smart Money Activity" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
              <InsiderActivityPanel data={data.insiderSummary} />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
              <InstitutionalFlowPanel data={data.institutionalSummary} />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
              <CotSummaryPanel data={data.cotSnapshots} />
            </div>
          </div>
        </section>

        <section>
          <SectionLabel label="Smart Money Signals" />
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <SmartMoneySignalsSection signals={data.signals} />
          </div>
        </section>

        <section>
          <SectionLabel label="Top Market Movers" />
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <TopMoversSection
              gainers={data.topMovers.topGainers}
              losers={data.topMovers.topLosers}
              breakouts={data.topMovers.volumeBreakouts}
            />
          </div>
        </section>

        <section>
          <SectionLabel label="Smart Money Score Table" />
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 overflow-x-auto">
            <SmartMoneyScoreTable rows={data.scoreTable} />
          </div>
        </section>
      </main>
    </div>
  );
}
