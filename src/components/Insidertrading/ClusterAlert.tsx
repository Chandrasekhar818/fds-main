import { Users } from 'lucide-react';

interface ClusterAlertData {
  insiderCount: number;
  totalValue: number;
  startDate: string;
  endDate: string;
}

export function ClusterAlert({ data }: { data: ClusterAlertData }) {
  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${(value / 1e3).toFixed(0)}K`;
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
  };

  return (
    <div className="bg-[#1a2e1f] border border-[#34d399]/30 rounded-sm">
      <div className="px-6 py-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-sm bg-[#34d399]/10 flex items-center justify-center flex-shrink-0 mt-1">
            <Users className="w-5 h-5 text-[#34d399]" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-[#34d399] mb-2">
              Cluster Buying Detected
            </h3>
            <p className="text-sm text-[#9ca3af] font-light leading-relaxed mb-3">
              Multiple insiders executed buy transactions within a concentrated timeframe, 
              potentially indicating coordinated conviction in the company's prospects.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-[#6b7280] mb-1">Insiders</p>
                <p className="text-lg font-light text-[#e8e9ea] tabular-nums">
                  {data.insiderCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6b7280] mb-1">Total Value</p>
                <p className="text-lg font-light text-[#e8e9ea] tabular-nums">
                  {formatCurrency(data.totalValue)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6b7280] mb-1">Date Range</p>
                <p className="text-sm font-light text-[#9ca3af]">
                  {formatDateRange(data.startDate, data.endDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}