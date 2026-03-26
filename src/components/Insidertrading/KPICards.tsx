'use client';

import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';

interface KPIData {
  totalBuyValue: number;
  totalSellValue: number;
  netFlow: number;
  transactionCount: number;
}

export function KPICards({ data }: { data: KPIData }) {
  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (absValue >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${(value / 1e3).toFixed(0)}K`;
  };

  const netFlowPositive = data.netFlow >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-sm bg-emerald-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500 font-light tracking-wide uppercase">
            Total Buy Value
          </p>
          <p className="text-2xl font-light text-gray-900 tabular-nums">
            {formatCurrency(data.totalBuyValue)}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-sm bg-red-50 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500 font-light tracking-wide uppercase">
            Total Sell Value
          </p>
          <p className="text-2xl font-light text-gray-900 tabular-nums">
            {formatCurrency(data.totalSellValue)}
          </p>
        </div>
      </div>

      <div className={`bg-white border rounded-sm p-6 shadow-sm ${
        netFlowPositive ? 'border-emerald-200' : 'border-red-200'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${
            netFlowPositive ? 'bg-emerald-50' : 'bg-red-50'
          }`}>
            <Activity className={`w-5 h-5 ${
              netFlowPositive ? 'text-emerald-600' : 'text-red-600'
            }`} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500 font-light tracking-wide uppercase">
            Net Insider Flow
          </p>
          <p className={`text-2xl font-light tabular-nums ${
            netFlowPositive ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {netFlowPositive ? '+' : ''}{formatCurrency(data.netFlow)}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-sm bg-blue-50 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500 font-light tracking-wide uppercase">
            Transactions
          </p>
          <p className="text-2xl font-light text-gray-900 tabular-nums">
            {data.transactionCount}
          </p>
        </div>
      </div>
    </div>
  );
}