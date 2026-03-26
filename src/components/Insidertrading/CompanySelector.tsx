"use client";

import { ChevronDown } from "lucide-react";

export interface CompanyOption {
  ticker: string;
  name: string;
}

export interface CompanySelectorProps {
  selected: string;
  onChange: (ticker: string) => void;
  options: CompanyOption[];
}

export function CompanySelector({
  selected,
  onChange,
  options,
}: CompanySelectorProps) {
  const companies = options;

  return (
    <div className="relative flex items-center">
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-sm px-4 py-2 pr-10 text-sm text-gray-900 font-light focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-colors cursor-pointer hover:border-gray-400"
      >
        {companies.map((company) => (
          <option key={company.ticker} value={company.ticker}>
            {company.ticker} - {company.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
}
