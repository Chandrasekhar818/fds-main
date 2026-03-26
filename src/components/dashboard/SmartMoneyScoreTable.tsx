'use client';
import { useState } from 'react';
import { SmartMoneyScore } from '@/types/dashboard';
import {
  gradeColor, scoreBarColor, trendColor,
  signalColor,
} from '@/lib/utils/dashboardUtils';
import { Section, TickerChip, TrendBadge } from './ui';

interface Props { rows: SmartMoneyScore[] }

type SortKey =
  | 'score'
  | 'insiderScore'
  | 'institutionalScore'
  | 'cotScore'
  | 'priceScore';

function ScoreCell({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${scoreBarColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-gray-600 w-7">
        {value}
      </span>
    </div>
  );
}

export function SmartMoneyScoreTable({ rows }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [asc, setAsc] = useState(false);

  function handleSort(k: SortKey) {
    if (k === sortKey) setAsc((a) => !a);
    else {
      setSortKey(k);
      setAsc(false);
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const diff = a[sortKey] - b[sortKey];
    return asc ? diff : -diff;
  });

  function Th({ label, k }: { label: string; k?: SortKey }) {
    const active = k && k === sortKey;

    return (
      <th
        onClick={k ? () => handleSort(k) : undefined}
        className={`
          px-4 py-3 text-xs uppercase tracking-wide font-semibold text-left
          whitespace-nowrap select-none
          ${k ? 'cursor-pointer hover:text-gray-900' : ''}
          ${active ? 'text-green-600' : 'text-gray-500'}
        `}
      >
        {label}
        {active && (
          <span className="ml-1 text-[10px]">
            {asc ? '▲' : '▼'}
          </span>
        )}
      </th>
    );
  }

  return (
    <Section
      title="Smart Money Score"
      subtitle="Composite ranking — insider × institutional × COT × price"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <Th label="Ticker" />
              <Th label="Score" k="score" />
              <Th label="Grade" />
              <Th label="Insider" k="insiderScore" />
              <Th label="Institutional" k="institutionalScore" />
              <Th label="COT" k="cotScore" />
              <Th label="Price" k="priceScore" />
              <Th label="Trend" />
              <Th label="Signal" />
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {sorted.map((row, i) => (
              <tr
                key={row.ticker}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div>
                    <TickerChip ticker={row.ticker} />
                    <p className="text-xs text-gray-500 mt-1">
                      {row.name}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${scoreBarColor(row.score)}`}
                        style={{ width: `${row.score}%` }}
                      />
                    </div>
                    <span
                      className={`text-sm font-semibold tabular-nums ${scoreBarColor(row.score).replace(
                        'bg-',
                        'text-'
                      )}`}
                    >
                      {row.score}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`text-base font-semibold ${gradeColor(
                      row.grade
                    )}`}
                  >
                    {row.grade}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <ScoreCell value={Number(row.insiderScore.toFixed(0))} />
                </td>

                <td className="px-4 py-3">
                  <ScoreCell
                    value={Number(row.institutionalScore.toFixed(0))}
                  />
                </td>

                <td className="px-4 py-3">
                  <ScoreCell value={Number(row.cotScore.toFixed(0))} />
                </td>

                <td className="px-4 py-3">
                  <ScoreCell value={Number(row.priceScore.toFixed(0))} />
                </td>

                <td className="px-4 py-3">
                  <TrendBadge trend={row.trend} />
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`text-sm font-medium ${signalColor(
                      row.signal
                    )}`}
                  >
                    {row.signal}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
