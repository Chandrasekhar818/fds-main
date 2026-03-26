import { TopMover } from '@/types/dashboard';
import { Section, TickerChip } from './ui';
import { fmtNumber, fmtPct } from '@/lib/utils/dashboardUtils';

interface MoverTableProps {
  rows: TopMover[];
  variant: 'gain' | 'loss' | 'volume';
}

function MoverRow({
  row,
  variant,
}: {
  row: TopMover;
  variant: MoverTableProps['variant'];
}) {
  const pctColor =
    row.changePct >= 0 ? 'text-green-600' : 'text-red-600';

  const volColor =
    row.volumeRatio >= 2 ? 'text-amber-600' : 'text-gray-500';

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <TickerChip ticker={row.ticker} />
        <p className="text-sm text-gray-600 font-medium truncate hidden sm:block">
          {row.name}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm text-gray-900 tabular-nums font-medium">
            ${row.price.toFixed(2)}
          </p>
        </div>

        <div className="text-right w-16">
          <p className={`text-sm font-semibold tabular-nums ${pctColor}`}>
            {fmtPct(row.changePct, true)}
          </p>
        </div>

        {variant === 'volume' && (
          <div className="text-right w-20">
            <p className={`text-sm tabular-nums font-medium ${volColor}`}>
              {row.volumeRatio.toFixed(2)}x
            </p>
            <p className="text-xs text-gray-500">
              {fmtNumber(row.volume)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function MoverTable({ rows, variant }: MoverTableProps) {
  return (
    <div>
      {/* Column Headers */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-200">
        <span className="text-xs uppercase tracking-wide text-gray-500 font-medium">
          Ticker
        </span>

        <div className="flex items-center gap-6">
          <span className="text-xs uppercase tracking-wide text-gray-500 font-medium">
            Price
          </span>

          <span className="text-xs uppercase tracking-wide text-gray-500 font-medium w-16 text-right">
            Chg%
          </span>

          {variant === 'volume' && (
            <span className="text-xs uppercase tracking-wide text-gray-500 font-medium w-20 text-right">
              Volume
            </span>
          )}
        </div>
      </div>

      {rows.map((r, index) => (
        <MoverRow
          key={`${r.ticker}-${index}`}
          row={r}
          variant={variant}
        />
      ))}
    </div>
  );
}

interface Props {
  gainers: TopMover[];
  losers: TopMover[];
  breakouts: TopMover[];
}

export function TopMoversSection({
  gainers,
  losers,
  breakouts,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Section title="Top Gainers" subtitle="By % change">
        <MoverTable rows={gainers} variant="gain" />
      </Section>

      <Section title="Top Losers" subtitle="By % change">
        <MoverTable rows={losers} variant="loss" />
      </Section>

      <Section title="Volume Breakouts" subtitle="Volume vs avg ratio">
        <MoverTable rows={breakouts} variant="volume" />
      </Section>
    </div>
  );
}
