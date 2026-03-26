'use client';

import { useState } from "react";
import TopHoldersBar from "@/components/institutionalholding/TopHoldersBar";
import HoldingsTable from "@/components/institutionalholding/HoldingsTable";
import { importInstitutionalCSV } from "@/app/actions/importInstitutionalCSV";
import { ImportInstitutionalModal } from "./ImportInstitutionalModal"; 

export default function InstitutionalClient({
  initialData,
  companyOptions,
}: {
  initialData: any[];
  companyOptions: any[];
}) {
  const [data] = useState(initialData);
  const [openImport, setOpenImport] = useState(false);

  const handleUpload = async (file: File) => {
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

      const result = await importInstitutionalCSV(file);

      if (!result) {
        alert("Import failed — no response from server.");
        return;
      }

      if (!result.success && result.inserted === 0) {
        alert(
          `Import Failed\n\n${result.message}\n\n` +
            (result.errors?.length
              ? `First Errors:\n${result.errors.join("\n")}`
              : "")
        );
        return;
      }

      if ((result.skipped ?? 0) > 0) {
        alert(
          `Import Completed With Warnings\n\n` +
            `Inserted Holdings: ${result.inserted}\n` +
            `New Companies: ${result.newCompanies}\n` +
            `Skipped Rows: ${result.skipped}\n\n` +
            (result.errors?.length
              ? `Sample Errors:\n${result.errors.slice(0, 5).join("\n")}`
              : "")
        );
      } else {
        alert(
          `Import Successful!\n\n` +
            `Inserted Holdings: ${result.inserted}\n` +
            `New Companies Created: ${result.newCompanies}`
        );
      }

      window.location.reload();
    } catch (error: any) {
      alert(
        `Import Failed\n\n` +
          (error?.message || "Something went wrong while importing the file.")
      );
    }
  };

 return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="border-b border-gray-200 bg-white sticky top-0 z-10"> */}
      <header className="border-b border-gray-200 bg-white">

        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-light text-gray-900">
              Institutional Holdings
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Institutional Ownership & Fund Position Analysis
            </p>
          </div>

          <button
            onClick={() => setOpenImport(true)}
            className="px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded border border-green-200 hover:bg-green-100 transition-colors whitespace-nowrap"
          >
            Import Institutional Data
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10">
        {/* Top Holders Section */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-medium text-gray-800">
            Top Institutional Holders
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <TopHoldersBar data={data} />
          </div>
        </section>

        {/* Holdings Table Section */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-medium text-gray-800">
            Institutional Positions
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <HoldingsTable data={data} />
          </div>
        </section>

        <ImportInstitutionalModal
          existing_companys={companyOptions}
          open={openImport}
          onClose={() => setOpenImport(false)}
          onUpload={handleUpload}
        />
      </main>
    </div>
  );

}