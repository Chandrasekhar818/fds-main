import { SmartMoneySignal } from '@/types/dashboard';
import {
  signalColor,
  signalBorder,
  signalDot,
  fmtShortDate,
  signalBg,
} from '@/lib/utils/dashboardUtils';
import { ConfidenceBar, SourceTags, TickerChip } from './ui';

interface Props {
  signals: SmartMoneySignal[];
}

function SignalCard({ s }: { s: SmartMoneySignal }) {
  return (
    <div
      className={`
        relative rounded-xl border bg-white p-5 shadow-sm
        ${signalBorder(s.type)} ${signalBg(s.type)}
      `}
    >
      {/* Left Accent Line */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${signalDot(
          s.type
        )}`}
      />

      <div className="pl-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <TickerChip ticker={s.ticker} />
            <span
              className={`text-xs font-semibold tracking-wide ${signalColor(
                s.type
              )}`}
            >
              {s.type.toUpperCase()}
            </span>
          </div>

          <span className="text-xs text-gray-500 flex-shrink-0">
            {fmtShortDate(s.date)}
          </span>
        </div>

        {/* Title */}
        <p className="text-sm font-semibold text-gray-900 mb-2">
          {s.title}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          {s.description}
        </p>

        {/* Confidence */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">
            Confidence
          </p>
          <ConfidenceBar value={s.confidence} />
        </div>

        {/* Sources */}
        <SourceTags sources={s.sources} />
      </div>
    </div>
  );
}

export function SmartMoneySignalsSection({ signals }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {signals.map((s) => (
        <SignalCard key={s.id} s={s} />
      ))}
    </div>
  );
}
