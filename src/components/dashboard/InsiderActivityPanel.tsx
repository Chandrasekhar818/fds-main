import { InsiderSummary } from '@/types/dashboard';
import { fmtCurrency, fmtShortDate, flowColor } from '@/lib/utils/dashboardUtils';
import { Section, DataRow, TickerChip, Divider } from './ui';

interface Props { data: InsiderSummary }

export function InsiderActivityPanel({ data }: Props) {
  const netPositive = data.netFlow >= 0;

  return (
    <Section
      title="Insider Activity"
      subtitle="Form 4 filings — all roles"
    >
      {/* aggregate stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm">
          <p className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">
            Total Buys
          </p>
          <p className="text-sm font-semibold text-green-600 tabular-nums">
            {fmtCurrency(data.totalBuyValue)}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm">
          <p className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">
            Total Sells
          </p>
          <p className="text-sm font-semibold text-red-600 tabular-nums">
            {fmtCurrency(data.totalSellValue)}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm">
          <p className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">
            Net Flow
          </p>
          <p className={`text-sm font-semibold tabular-nums ${flowColor(data.netFlow)}`}>
            {netPositive ? '+' : ''}{fmtCurrency(data.netFlow)}
          </p>
        </div>
      </div>

      {/* net flow bar */}
      <div className="mb-6">
        <div className="flex justify-between text-[10px] text-gray-500 mb-2">
          <span>Buy pressure</span>
          <span>Sell pressure</span>
        </div>

        <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
          {(() => {
            const total = data.totalBuyValue + data.totalSellValue;
            const buyPct = total > 0 ? (data.totalBuyValue / total) * 100 : 50;

            return (
              <div className="h-full flex">
                <div
                  className="bg-green-500"
                  style={{ width: `${buyPct}%` }}
                />
                <div className="bg-red-400 flex-1" />
              </div>
            );
          })()}
        </div>
      </div>

      <Divider />

      {/* top trades */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Top Trades
      </p>

      <div className="space-y-0">
        {data.topTrades.map(t => (
          <div
            key={t.id}
            className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              <TickerChip ticker={t.ticker} />

              <div className="min-w-0">
                <p className="text-sm text-gray-900 font-medium truncate">
                  {t.insiderName}
                </p>
                <p className="text-xs text-gray-500">
                  {t.role} · {fmtShortDate(t.date)}
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0 ml-4">
              <p
                className={`text-sm font-semibold tabular-nums ${
                  t.type === 'Buy' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {t.type === 'Buy' ? '+' : '−'}
                {fmtCurrency(t.totalValue)}
              </p>
              <p className="text-xs text-gray-500">
                {t.type}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
