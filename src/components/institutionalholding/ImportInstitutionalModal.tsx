"use client";

import { useMemo, useState } from "react";
import { X, AlertTriangle, FileText, Building } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  existing_companys?: { ticker: string; name: string }[];
}

export function ImportInstitutionalModal({
  open,
  onClose,
  onUpload,
  existing_companys = [],
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const filteredCompanies = useMemo(() => {
    if (!search.trim()) return existing_companys;
    const term = search.toLowerCase();

    return existing_companys.filter(
      (c) =>
        c.ticker.toLowerCase().includes(term) ||
        c.name.toLowerCase().includes(term)
    );
  }, [search, existing_companys]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    await onUpload(file);
    setLoading(false);
    setFile(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      
      {/* Modal Container */}
      <div className="bg-white border border-gray-200 w-full max-w-2xl rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            Import Institutional Holdings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="text-yellow-600 mt-1" size={18} />
            <div className="text-sm text-gray-700 space-y-2">
              <p className="font-medium text-yellow-800">
                Important Upload Rules
              </p>

              <ul className="list-disc ml-5 space-y-1 text-gray-600">
                <li>Tickers must match existing companies exactly.</li>
                <li>If ticker does not exist → new company will be created automatically.</li>
                <li>Duplicate fund-quarter records will be updated.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Existing Companies */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:items-center mb-4">
            <div className="flex gap-2 items-center">
              <Building size={16} className="text-blue-600" />
              <p className="text-sm font-medium text-gray-900">
                Existing Companies ({existing_companys.length})
              </p>
            </div>

            {existing_companys.length > 0 && (
              <input
                type="text"
                placeholder="Search by ticker or company name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none"
              />
            )}
          </div>

          {existing_companys.length === 0 ? (
            <p className="text-sm text-gray-500">
              No companies found. Uploading will create new companies automatically.
            </p>
          ) : (
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md bg-white">
              {filteredCompanies.map((c) => (
                <div
                  key={c.ticker}
                  className="flex justify-between px-3 py-2 text-sm border-b border-gray-100 last:border-none"
                >
                  <span className="text-blue-600 font-medium">
                    {c.ticker}
                  </span>
                  <span className="text-gray-600">{c.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CSV Format */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
          <div className="flex gap-3 mb-3">
            <FileText className="text-blue-600 mt-1" size={18} />
            <p className="font-medium text-gray-900">
              Required CSV Columns
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="space-y-1">
              <p>fund_name</p>
              <p>company_name</p>
              <p>ticker</p>
              <p>cusip</p>
              <p>shares</p>
            </div>
            <div className="space-y-1">
              <p>value</p>
              <p>weight</p>
              <p>quarter</p>
              <p>reported_date</p>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-gray-900 bg-white border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="w-full py-2 bg-green-50 text-green-700 text-sm rounded-md border border-green-200 hover:bg-green-100 transition-colors disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload & Import Holdings"}
        </button>
      </div>
    </div>
  );
}
