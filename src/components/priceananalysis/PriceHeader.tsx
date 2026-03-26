"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CompanySelector } from "@/components/Insidertrading/CompanySelector";
import { DateRangeFilter } from "@/components/Insidertrading/DateRangeFilter";
import { DateRangeOption } from "@/lib/utils/date-range";
import { ImportPriceModal } from "./ImportPriceModal";

type Company = {
  ticker: string;
  name: string;
};

type Props = {
  companies: Company[];
  selectedTicker: string;
  selectedRange?: DateRangeOption;
  existing_companys: Company[];
  onUpload: (file: File) => void;
};

export default function PriceHeader({
  companies,
  selectedTicker,
  selectedRange: defaultRange,
  existing_companys,
  onUpload,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [openImport, setOpenImport] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(selectedTicker);
  const [range, setRange] = useState<DateRangeOption>(
    (searchParams.get("range") as DateRangeOption) || defaultRange || "1y"
  );

  // Sync ticker with URL
  useEffect(() => {
    const tickerFromURL = searchParams.get("ticker");
    if (tickerFromURL && tickerFromURL !== selectedCompany) {
      setSelectedCompany(tickerFromURL);
    }
  }, [searchParams, selectedCompany]);

  // Handle company change
  const handleCompanyChange = (ticker: string) => {
    setSelectedCompany(ticker);
    const params = new URLSearchParams(searchParams.toString());
    params.set("ticker", ticker);

    router.push(`?${params.toString()}`);
    router.refresh();
  };

  // Handle range change
  const handleRangeChange = (newRange: DateRangeOption) => {
    setRange(newRange);
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", newRange);

    router.push(`?${params.toString()}`, { scroll: false });
    router.refresh();
  };

  const selectedCompanyObj = useMemo(
    () => companies.find((c) => c.ticker === selectedCompany),
    [companies, selectedCompany]
  );

  const companyName = selectedCompanyObj?.name ?? selectedCompany;

  return (
    <>
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1600px] px-8 py-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-light text-gray-900">{companyName}</h1>
            <p className="text-sm text-gray-500">{selectedCompany} • Price Analysis</p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <CompanySelector
              selected={selectedCompany}
              onChange={handleCompanyChange}
              options={companies}
            />

            <DateRangeFilter selected={range} onChange={handleRangeChange} />

            <button
              onClick={() => setOpenImport(true)}
              className="px-4 py-2 bg-green-50 text-green-700 text-sm rounded-sm border border-green-200 hover:bg-green-100 transition-colors font-medium"
            >
              Import Price Data
            </button>
          </div>
        </div>
      </header>

      <ImportPriceModal
        open={openImport}
        onClose={() => setOpenImport(false)}
        onUpload={onUpload}
        existing_companys={existing_companys}
      />
    </>
  );
}
