'use client';

import { formatCurrency } from "@/lib/utils/date-range";

interface ConvictionData {
  score: number;
  factors: {
    roleDiversity: number;
    transactionValue: number;
    insiderCount: number;
  };
}

export function ConvictionScore({ data }: { data: ConvictionData }) {
  const percentage = (data.score / 10) * 100;
  
  const getScoreColor = (score: number) => {
    if (score >= 7) return '#10b981';   
    if (score >= 4) return '#f59e0b';  
    return '#ef4444';                
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Very Strong';
    if (score >= 6) return 'Strong';
    if (score >= 4) return 'Moderate';
    if (score >= 2) return 'Weak';
    return 'Very Weak';
  };

  const scoreColor = getScoreColor(data.score);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mb-2">
          <span className="text-5xl font-extralight text-gray-900 tabular-nums">
            {data?.score?.toFixed(1)}
          </span>
          <span className="text-2xl text-gray-500 font-light">/10</span>
        </div>
        <p className="text-sm font-medium" style={{ color: scoreColor }}>
          {getScoreLabel(data.score)}
        </p>
      </div>

      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: scoreColor
          }}
        />
      </div>

      <div className="space-y-4 pt-2">
        <h4 className="text-xs text-gray-500 font-medium tracking-wide uppercase">
          Contributing Factors
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-light">Role Weight</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(data.factors.roleDiversity / 10) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-900 font-light tabular-nums w-8 text-right">
                {data.factors.roleDiversity?.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-light">Transaction Value</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(data.factors.transactionValue / 10) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-900 font-light tabular-nums w-8 text-right">
                {formatCurrency(data.factors.transactionValue)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-light">Insider Count</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(data.factors.insiderCount / 10) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-900 font-light tabular-nums w-8 text-right">
                {data.factors.insiderCount?.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 font-light leading-relaxed">
            The conviction score aggregates insider transaction patterns, role seniority, 
            and transaction magnitude to assess the strength of insider sentiment.
          </p>
        </div>
      </div>
    </div>
  );
}