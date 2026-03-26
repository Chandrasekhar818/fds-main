'use client';
import { useState, useMemo } from 'react';
import { CotRow } from '@/types/cot';

interface Props { data: CotRow[] }

type SortKey = keyof CotRow;
type SortDir = 'asc' | 'desc';

function fmtNum(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function fmtDate(s: string): string {
  return new Date(s).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

interface ColDef {
  key: SortKey;
  label: string;
  align: 'left' | 'right';
  render: (row: CotRow) => React.ReactNode;
}

const COLS: ColDef[] = [
  { key: 'report_date', label: 'Date', align: 'left',
    render: r => fmtDate(r.report_date) },

  { key: 'commercial_long', label: 'Comm Long', align: 'right',
    render: r => fmtNum(r.commercial_long) },

  { key: 'commercial_short', label: 'Comm Short', align: 'right',
    render: r => fmtNum(r.commercial_short) },

  { key: 'commercial_net', label: 'Comm Net', align: 'right',
    render: r => (
      <span className={r.commercial_net >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
        {r.commercial_net >= 0 ? '+' : ''}{fmtNum(r.commercial_net)}
      </span>
    )},

  { key: 'speculator_long', label: 'Spec Long', align: 'right',
    render: r => fmtNum(r.speculator_long) },

  { key: 'speculator_short', label: 'Spec Short', align: 'right',
    render: r => fmtNum(r.speculator_short) },

  { key: 'speculator_net', label: 'Spec Net', align: 'right',
    render: r => (
      <span className={r.speculator_net >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
        {r.speculator_net >= 0 ? '+' : ''}{fmtNum(r.speculator_net)}
      </span>
    )},

  { key: 'open_interest', label: 'Open Interest', align: 'right',
    render: r => fmtNum(r.open_interest) },
];

export function CotDataTable({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('report_date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(0);
  const PER_PAGE = 10;

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const av = a[sortKey] as any;
      const bv = b[sortKey] as any;
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ?  1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDir]);

  const paged = sorted.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const maxPage = Math.max(0, Math.ceil(sorted.length / PER_PAGE) - 1);

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    const active = col === sortKey;
    return (
      <span className={`ml-1 text-[10px] ${active ? 'text-green-600' : 'text-gray-400'}`}>
        {active ? (sortDir === 'desc' ? '▼' : '▲') : '⇅'}
      </span>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

      {/* Scroll Wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">

          {/* Header */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {COLS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`
                    px-4 sm:px-6 py-3 text-[11px] font-semibold uppercase tracking-wide
                    text-gray-600 cursor-pointer select-none
                    hover:text-gray-900 transition-colors whitespace-nowrap
                    ${col.align === 'right' ? 'text-right' : 'text-left'}
                  `}
                >
                  {col.label}
                  <SortIcon col={col.key} />
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {paged.map((row, i) => (
              <tr
                key={row.report_date + i}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {COLS.map(col => (
                  <td
                    key={col.key}
                    className={`
                      px-4 sm:px-6 py-3 text-gray-700 tabular-nums whitespace-nowrap
                      ${col.align === 'right' ? 'text-right' : 'text-left'}
                    `}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500">
          Showing {page * PER_PAGE + 1}–
          {Math.min((page + 1) * PER_PAGE, sorted.length)} of {sorted.length} rows
        </p>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 text-xs rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 transition"
          >
            Prev
          </button>

          {Array.from({ length: Math.min(5, maxPage + 1) }, (_, i) => i).map(i => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-8 h-8 text-xs rounded-md transition ${
                i === page
                  ? 'bg-green-600 text-white'
                  : 'bg-white border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage(p => Math.min(maxPage, p + 1))}
            disabled={page === maxPage}
            className="px-3 py-1.5 text-xs rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
