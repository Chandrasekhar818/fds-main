import { CotSnapshot } from '@/types/dashboard';
import { fmtNumber, cotBiasColor } from '@/lib/utils/dashboardUtils';
import { Section } from './ui';

interface Props { data: CotSnapshot[] }

function BiasBar({ strength, bias }: { strength: number; bias: string }) {
  const color =
    bias === 'Bullish'
      ? 'bg-green-500'
      : bias === 'Bearish'
      ? 'bg-red-500'
      : 'bg-gray-400';

  return (
    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${strength}%` }}
      />
    </div>
  );
}

export function CotSummaryPanel({ data }: Props) {
  return (
    <Section
      title="COT Positioning"
      subtitle="Commitment of Traders — latest report"
    >
      <div className="divide-y divide-gray-200">

        {data.map((row) => (
          <div key={row.market} className="py-4">

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-800">
                {row.market}
              </p>

              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cotBiasColor(row.bias)}`}
              >
                {row.bias}
              </span>
            </div>

            {/* Net Positions */}
            <div className="grid grid-cols-3 gap-4 mb-3">

              <div>
                <p className="text-xs text-gray-500 mb-1">Comm Net</p>
                <p
                  className={`text-sm font-medium tabular-nums ${
                    row.commercial_net >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {row.commercial_net >= 0 ? '+' : ''}
                  {fmtNumber(row.commercial_net)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Spec Net</p>
                <p
                  className={`text-sm font-medium tabular-nums ${
                    row.speculator_net >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {row.speculator_net >= 0 ? '+' : ''}
                  {fmtNumber(row.speculator_net)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Open Interest</p>
                <p className="text-sm font-medium text-gray-700 tabular-nums">
                  {fmtNumber(row.open_interest)}
                </p>
              </div>
            </div>

            {/* Bias Strength Bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <BiasBar strength={row.biasStrength} bias={row.bias} />
              </div>
              <span className="text-xs text-gray-500 tabular-nums w-10 text-right">
                {row.biasStrength}th
              </span>
            </div>

          </div>
        ))}

      </div>
    </Section>
  );
}
