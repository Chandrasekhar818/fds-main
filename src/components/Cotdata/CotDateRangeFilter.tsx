'use client';
import { DateRangeOptions, DateRangeKey } from '@/types/cot';

interface Props {
  options: DateRangeOptions[];
  selected: DateRangeKey;
  onChange: (v: DateRangeKey) => void;
}

export function CotDateRangeFilter({ options, selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">

      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`
            px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md
            transition-all duration-200 whitespace-nowrap
            ${
              selected === o.value
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }
          `}
        >
          {o.label}
        </button>
      ))}

    </div>
  );
}
