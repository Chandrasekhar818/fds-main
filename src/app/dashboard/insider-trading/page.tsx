"use client";

import { useState, useEffect, useMemo } from "react";
import { KPICards } from "@/components/Insidertrading/KPICards";
import { InsiderActivityChart } from "@/components/Insidertrading/InsiderActivityChart";
import { TransactionsTable } from "@/components/Insidertrading/TransactionsTable";
import { ClusterAlert } from "@/components/Insidertrading/ClusterAlert";
import { ConvictionScore } from "@/components/Insidertrading/ConvictionScore";
import { PriceReactionChart } from "@/components/Insidertrading/PriceReactionChart";
import { CompanySelector } from "@/components/Insidertrading/CompanySelector";
import { DateRangeFilter } from "@/components/Insidertrading/DateRangeFilter";
import {
  fetchInsiderDashboard,
  fetchUserCompanyOptions,
} from "@/app/actions/insider-analytics";
import { DateRangeOption, getDateRange } from "@/lib/utils/date-range";
import { ImportInsiderModal } from "@/components/Insidertrading/ImportInsiderModal";
import { importInsiderCSV } from "@/app/actions/importInsiderCSV";

export default function InsiderAnalytics() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeOption>("1y");
  const [dashboard, setDashboard] = useState<any>(null);
  const [companyOptions, setCompanyOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openImport, setOpenImport] = useState(false);

  useEffect(() => {
    const loadCompanies = async () => {
      const result = await fetchUserCompanyOptions();
      setCompanyOptions(result ?? []);
      if (result?.length > 0) {
        setSelectedCompany(result[0].ticker);
      }
    };
    loadCompanies();
  }, []);

  useEffect(() => {
    if (!selectedCompany) return;

    const loadDashboard = async () => {
      setLoading(true);

      const { fromDate, toDate } = getDateRange(dateRange);

      const result = await fetchInsiderDashboard({
        ticker: selectedCompany,
        fromDate,
        toDate,
      });

      setDashboard(result);
      setLoading(false);
    };

    loadDashboard();
  }, [selectedCompany, dateRange]);

  const tableData = useMemo(() => {
    return (
      dashboard?.trades?.map((t: any) => ({
        id: `${t.date}-${t.insiderName}`,
        insiderName: t.insiderName,
        role: t.role,
        type: t.type,
        shares: t.shares,
        price: t.price,
        totalValue: Math.round(t.value),
        date: t.date,
      })) ?? []
    );
  }, [dashboard]);

  const priceData = useMemo(() => {
    if (!dashboard?.insiderTimeline) return [];

    return dashboard?.insiderTimeline.map((day: any) => {
      const insiderForDay = dashboard.trades?.filter(
        (t: any) => t.date === day.date,
      );

      return {
        date: day.date,
        price: day.buyValue || day.sellValue || 0,
        insiderActivity: insiderForDay?.length
          ? {
              type: insiderForDay[0].type,
              insiderName: insiderForDay
                .map((i: any) => i.insiderName)
                .join(", "),
              value: insiderForDay.reduce(
                (sum: number, i: any) => sum + i.value,
                0,
              ),
            }
          : undefined,
      };
    });
  }, [dashboard]);

  const handleFileUpload = async (file: File) => {
    try {
      if (!file) return;

      if (!file.name.toLowerCase().endsWith(".csv")) {
        alert("Only CSV files are allowed.");
        return;
      }

      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        alert("File too large. Max allowed size is 5MB.");
        return;
      }

      const result = await importInsiderCSV(file);

      if (!result) {
        alert("Import failed — no response from server.");
        return;
      }

      if (!result.success && result.inserted === 0) {
        alert(
          `Import Failed\n\n${result.message}\n\n` +
            (result.errors?.length
              ? `First Errors:\n${result.errors.join("\n")}`
              : ""),
        );
        return;
      }

      if (result.skipped > 0) {
        alert(
          ` Import Completed With Warnings\n\n` +
            ` Inserted: ${result.inserted}\n` +
            ` New Companies: ${result.newCompanies}\n` +
            ` Skipped Rows: ${result.skipped}\n\n` +
            (result.errors?.length
              ? `Sample Errors:\n${result.errors.slice(0, 5).join("\n")}`
              : ""),
        );
      } else {
        alert(
          ` Import Successful!\n\n` +
            `Inserted Trades: ${result.inserted}\n` +
            `New Companies Created: ${result.newCompanies}`,
        );
      }

      if (selectedCompany) {
        const { fromDate, toDate } = getDateRange(dateRange);

        const refreshed = await fetchInsiderDashboard({
          ticker: selectedCompany,
          fromDate,
          toDate,
        });

        setDashboard(refreshed);
      }
    } catch (error: any) {
      console.error("Upload failed:", error);

      alert(
        ` Import Failed\n\n` +
          (error?.message || "Something went wrong while importing the file."),
      );
    }
  };

  if (!dashboard) return null;

 return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1600px] px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-light text-gray-900">
              Insider Analytics
            </h1>
            <p className="text-sm text-gray-500">
              Form 4 Filing Analysis & Pattern Detection
            </p>
          </div>

          <div className="flex items-center gap-4">
            <CompanySelector
              selected={selectedCompany ?? ""}
              onChange={setSelectedCompany}
              options={companyOptions}
            />
            <DateRangeFilter selected={dateRange} onChange={setDateRange} />
            <button
              onClick={() => setOpenImport(true)}
              className="px-4 py-2 bg-green-50 text-green-700 text-sm rounded-sm border border-green-200 hover:bg-green-100 transition-colors"
            >
              Import Insider Data
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-8 py-8 space-y-10">
        <section>
          <h2 className="text-xl font-medium text-gray-800 mb-4">
            Key Performance Indicators
          </h2>
          <KPICards
            data={
              dashboard?.kpis ?? {
                totalBuyValue: 0,
                totalSellValue: 0,
                netFlow: 0,
                transactionCount: 0,
              }
            }
          />
        </section>

        {dashboard?.clusterSignals?.length > 0 && (
          <section>
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              Important Signals
            </h2>
            <ClusterAlert data={dashboard.clusterSignals[0]} />
          </section>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-800">
                  Insider Activity by Role
                </h2>
              </div>
              <div className="p-6">
                <InsiderActivityChart data={dashboard?.activityByRole ?? []} />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-800">
                  Price Movement & Insider Activity Timeline
                </h2>
              </div>
              <div className="p-6">
                <PriceReactionChart data={priceData} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm h-fit">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-800">
                Conviction Score
              </h2>
            </div>
            <div className="p-6">
              <ConvictionScore
                data={
                  dashboard?.conviction ?? {
                    score: 0,
                    factors: {
                      roleDiversity: 0,
                      transactionValue: 0,
                      insiderCount: 0,
                    },
                  }
                }
              />
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-800">
              Recent Insider Transactions
            </h2>
          </div>
          <TransactionsTable data={tableData} />
        </section>

        <ImportInsiderModal
          open={openImport}
          onClose={() => setOpenImport(false)}
          onUpload={handleFileUpload}
          existing_companys={companyOptions}
        />
      </main>
    </div>
  );
}