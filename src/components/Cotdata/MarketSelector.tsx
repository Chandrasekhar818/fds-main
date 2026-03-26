'use client';

interface Props {
  options: { market: string }[];
  selected: string | null;
  onChange: (v: string) => void;
}

export function MarketSelector({ options, selected, onChange }: Props) {
  return (
    <div className="relative w-full sm:w-auto min-w-[180px]">
      <select
        value={selected ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          appearance-none
          bg-white
          border border-gray-300
          text-gray-800
          text-sm font-medium
          px-4 pr-10 py-2.5
          rounded-lg
          shadow-sm
          focus:outline-none
          focus:ring-2 focus:ring-emerald-500/40
          focus:border-emerald-500
          transition-all
          cursor-pointer
        "
      >
        {options.map((m, index) => (
          <option key={index} value={m.market}>
            {m.market}
          </option>
        ))}
      </select>

      {/* Dropdown Icon */}
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
        <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 8L1 3h10L6 8z" />
        </svg>
      </span>
    </div>
  );
}
