import { InstitutionalSummary } from '@/types/dashboard';
import { fmtCurrency, flowColor } from '@/lib/utils/dashboardUtils';
import { Section, Divider, TickerChip } from './ui';

interface Props { data: InstitutionalSummary }

export function InstitutionalFlowPanel({ data }: Props) {
  return (
    <Section
      title="Institutional Flow"
      subtitle="13F / dark pool signals"
    >
      {/* net flow headline */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 text-center shadow-sm">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
          Total Net Flow
        </p>

        <p className={`text-3xl font-semibold tabular-nums ${flowColor(data.totalNetFlow)}`}>
          {data.totalNetFlow >= 0 ? '+' : ''}
          {fmtCurrency(data.totalNetFlow)}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          Rolling 4-week
        </p>
      </div>

      {/* accumulated */}
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
        Top Accumulated
      </p>

      <div className="space-y-0 mb-6">
        {data.topAccumulated.map(f => (
          <div
            key={f.ticker}
            className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
          >
            <div className="flex items-center gap-3">
              <TickerChip ticker={f.ticker} />

              <div>
                <p className="text-sm text-gray-900 font-medium">
                  {f.name}
                </p>
                <p className="text-xs text-gray-500">
                  {f.institutions} institutions
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-green-600 tabular-nums">
                +{fmtCurrency(f.netFlow)}
              </p>

              <div className="flex justify-end mt-2">
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (f.buyValue / (f.buyValue + Math.abs(f.sellValue))) * 100
                      )}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Divider />

      {/* distributed */}
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
        Top Distributed
      </p>

      <div className="space-y-0">
        {data.topDistributed.map(f => (
          <div
            key={f.ticker}
            className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
          >
            <div className="flex items-center gap-3">
              <TickerChip ticker={f.ticker} />

              <div>
                <p className="text-sm text-gray-900 font-medium">
                  {f.name}
                </p>
                <p className="text-xs text-gray-500">
                  {f.institutions} institutions
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-red-600 tabular-nums">
                {fmtCurrency(f.netFlow)}
              </p>

              <div className="flex justify-end mt-2">
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                  <div
                    className="h-full bg-red-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (Math.abs(f.sellValue) /
                          (f.buyValue + Math.abs(f.sellValue))) * 100
                      )}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
