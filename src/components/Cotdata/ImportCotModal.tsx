"use client";

import { useMemo, useState } from "react";
import { X, AlertTriangle, FileText, BarChart3 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File, market: string) => Promise<void>;
  existingMarkets?: { market: string }[];
}

export function ImportCotModal({
  open,
  onClose,
  onUpload,
  existingMarkets = [],
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("");
  const [error, setError] = useState<string | null>(null);

  // ✅ Hooks must always run
  const filteredMarkets = useMemo(() => {
    if (!search.trim()) return existingMarkets;

    return existingMarkets.filter((m) =>
      m.market.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, existingMarkets]);

  // ✅ AFTER all hooks
  if (!open) return null;

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    if (!selectedMarket) {
      setError("Please select or enter a market.");
      return;
    }

    setLoading(true);
    setError(null);

    await onUpload(file, selectedMarket);

    setLoading(false);
    setFile(null);
    setSelectedMarket("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 w-full max-w-2xl rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            Import COT Reports
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Existing Markets */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:items-center mb-4">
            <div className="flex gap-2 items-center">
              <BarChart3 size={16} className="text-blue-600" />
              <p className="text-sm font-medium text-gray-900">
                Existing Markets ({existingMarkets.length})
              </p>
            </div>

            <input
              type="text"
              placeholder="Search market..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md"
            />
          </div>

          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md bg-white">
            {filteredMarkets.map((m) => (
              <button
                key={m.market}
                onClick={() => setSelectedMarket(m.market)}
                className={`w-full text-left px-3 py-2 text-sm border-b border-gray-100 hover:bg-green-50 ${
                  selectedMarket === m.market
                    ? "bg-green-100 font-medium"
                    : ""
                }`}
              >
                {m.market}
              </button>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full mb-4"
        />

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="w-full py-2 bg-green-50 text-green-700 text-sm rounded-md border border-green-200"
        >
          {loading ? "Uploading..." : "Upload & Import COT Data"}
        </button>
      </div>
    </div>
  );
}
