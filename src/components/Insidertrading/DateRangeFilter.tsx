'use client';

import { DateRangeOption } from "@/lib/utils/date-range";

interface DateRangeFilterProps {
  selected: DateRangeOption;
  onChange: (value: DateRangeOption) => void;
}

export function DateRangeFilter({ selected, onChange }: DateRangeFilterProps) {
  const ranges = [
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '6m', label: '6 Months' },
    { value: '1y', label: '1 Year' },
    { value: '2y', label: '2 Years' },
  ];

  return (
    <div className="flex items-center gap-1 bg-gray-100 border border-gray-300 rounded-sm p-1">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value as DateRangeOption)}
          className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
            selected === range.value
              ? 'bg-gray-800 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}