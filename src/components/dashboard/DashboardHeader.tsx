interface Props {
  lastUpdated: string;
}

export function DashboardHeader({ lastUpdated }: Props) {
  const ts = new Date(lastUpdated).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          {/* Left Section */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-1 h-5 bg-green-500 rounded-sm flex-shrink-0" />
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight">
                Smart Money Analytics
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 ml-4">
              Insider · Institutional · COT · Price — combined signal dashboard
            </p>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">

            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-700">
                Live
              </span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-4 w-px bg-gray-200" />

            {/* Timestamp */}
            <span className="text-xs text-gray-500 tabular-nums">
              Last updated: {ts}
            </span>

          </div>
        </div>
      </div>
    </header>
  );
}
