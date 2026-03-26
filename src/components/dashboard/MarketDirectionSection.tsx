import { MarketDirectionSummary } from '@/types/dashboard';
import { fmtCurrency, trendColor, flowColor, cotBiasColor } from '@/lib/utils/dashboardUtils';

interface Props { data: MarketDirectionSummary }

interface CardProps {
  label: string;
  value: React.ReactNode;
  sub: string;
  accent: string;
  dot?: string;
}

function DirectionCard({ label, value, sub, accent, dot }: CardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative overflow-hidden transition hover:shadow-md">
      
      {/* top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${accent}`} />

      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-5">
        {label}
      </p>

      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {dot && (
              <span className={`w-2.5 h-2.5 rounded-full ${dot} flex-shrink-0`} />
            )}
            <span className="text-2xl font-semibold tabular-nums text-gray-900">
              {value}
            </span>
          </div>

          <p className="text-sm text-gray-500">
            {sub}
          </p>
        </div>
      </div>
    </div>
  );
}

export function MarketDirectionSection({ data }: Props) {

  const trendAccent =
    data.overallTrend === 'Bullish'
      ? 'bg-green-500'
      : data.overallTrend === 'Bearish'
      ? 'bg-red-500'
      : 'bg-gray-400';

  const trendDot = trendAccent;

  const instAccent =
    data.institutionalNetFlow >= 0
      ? 'bg-green-500'
      : 'bg-red-500';

  const instDot = instAccent;

  const insiderAccent =
    data.insiderSentiment === 'Bullish'
      ? 'bg-green-500'
      : data.insiderSentiment === 'Bearish'
      ? 'bg-red-500'
      : 'bg-gray-400';

  const insiderDot = insiderAccent;

  const cotAccent =
    data.cotBias === 'Bullish'
      ? 'bg-green-500'
      : data.cotBias === 'Bearish'
      ? 'bg-red-500'
      : 'bg-gray-400';

  const cotDot = cotAccent;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      
      <DirectionCard
        label="Price Trend"
        value={
          <span className={trendColor(data.overallTrend)}>
            {data.overallTrend}
          </span>
        }
        sub={`Strength ${data.trendStrength}/100`}
        accent={trendAccent}
        dot={trendDot}
      />

      <DirectionCard
        label="Institutional Net Flow"
        value={
          <span className={flowColor(data.institutionalNetFlow)}>
            {fmtCurrency(data.institutionalNetFlow)}
          </span>
        }
        sub="Rolling 4-week period"
        accent={instAccent}
        dot={instDot}
      />

      <DirectionCard
        label="Insider Sentiment"
        value={
          <span
            className={
              data.insiderSentiment === 'Bullish'
                ? 'text-green-600'
                : data.insiderSentiment === 'Bearish'
                ? 'text-red-600'
                : 'text-gray-500'
            }
          >
            {data.insiderSentiment}
          </span>
        }
        sub={`Net ${fmtCurrency(data.insiderNetFlow)} insiders`}
        accent={insiderAccent}
        dot={insiderDot}
      />

      <DirectionCard
        label="COT Market Bias"
        value={
          <span className={cotBiasColor(data.cotBias)}>
            {data.cotBias}
          </span>
        }
        sub={`Percentile strength ${data.cotStrength}`}
        accent={cotAccent}
        dot={cotDot}
      />

    </div>
  );
}
