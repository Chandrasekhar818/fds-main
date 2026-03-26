"use client";

import { useMemo, useState } from "react";
import { X, AlertTriangle, FileText, Building } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  existing_companys?: { ticker: string; name: string }[];
}

export function ImportInsiderModal({
  open,
  onClose,
  onUpload,
  existing_companys = [],
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const filteredCompanies = useMemo(() => {
    if (!search.trim()) return existing_companys;

    const term = search.toLowerCase();

    return existing_companys.filter(
      (c) =>
        c.ticker.toLowerCase().includes(term) ||
        c.name.toLowerCase().includes(term),
    );
  }, [search, existing_companys]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    await onUpload(file);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 w-[750px] rounded-sm p-6 max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg text-gray-900 font-medium">
            Import Insider Trading Data
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-4 mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="text-yellow-600 mt-1" size={18} />
            <div className="text-sm text-gray-800 space-y-2">
              <p className="font-medium text-yellow-800">
                Important Upload Rules
              </p>

              <ul className="list-disc ml-5 space-y-1 text-gray-600">
                <li>Tickers must match existing companies exactly.</li>
                <li>If ticker does not exist → new company will be created.</li>
                {/* <li>Duplicate insider records will be ignored.</li> */}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 mb-6">
          <div className="flex justify-between gap-2 items-center mb-3">
            <div className="flex gap-2 items-center">
              <Building size={16} className="text-blue-600" />
              <p className="text-sm font-medium text-gray-900">
                Your Existing Companies ({existing_companys.length})
              </p>
            </div>
            {existing_companys.length > 0 && (
              <input
                type="text"
                placeholder="Search by ticker or company name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="min-w-[300px] mb-3 px-3 py-2 text-sm bg-white border border-gray-300 rounded-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none"
              />
            )}
          </div>

          {existing_companys.length === 0 ? (
            <p className="text-sm text-gray-500">
              No companies found. Uploading will create new companies
              automatically.
            </p>
          ) : (
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-sm bg-white">
              {filteredCompanies.length === 0 ? (
                <p className="p-3 text-sm text-gray-500">
                  No matching companies found.
                </p>
              ) : (
                filteredCompanies.map((c) => (
                  <div
                    key={c.ticker}
                    className="flex justify-between px-3 py-2 text-sm border-b border-gray-100 last:border-none hover:bg-gray-50"
                  >
                    <span className="text-blue-600 font-medium">
                      {c.ticker}
                    </span>
                    <span className="text-gray-600">{c.name}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 mb-6">
          <div className="flex gap-3 mb-2">
            <FileText className="text-blue-600 mt-1" size={18} />
            <p className="font-medium text-gray-900">Required CSV Columns</p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 text-sm text-gray-600 ml-6">
            <div className="space-y-1">
              <p>ticker</p>
              <p>company_name</p>
              <p>transaction_date</p>
              <p>insider_name</p>
              <p>insider_title</p>
              <p>transaction_type (P/S)</p>
              <p>shares</p>
            </div>

            <div className="space-y-1">
              <p>price</p>
              <p>value</p>
              <p>ownership_type</p>
              <p>filing_date</p>
              <p>source</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">
            Upload CSV File
          </label>

          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-gray-700 bg-white border border-gray-300 p-2 rounded-sm file:mr-4 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="w-full py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? "Uploading..." : "Upload & Import Data"}
        </button>
      </div>
    </div>
  );
}
