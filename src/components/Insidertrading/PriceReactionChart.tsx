'use client';

import { formatCurrency } from '@/lib/utils/date-range';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

interface PriceDataPoint {
  date: string;
  price: number;
  insiderActivity?: {
    type: 'Buy' | 'Sell';
    insiderName: string;
    value: number;
  };
}

export function PriceReactionChart({ data }: { data: PriceDataPoint[] }) {
  const formatPrice = (value: number) => formatCurrency(value, 2);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };



  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-300 rounded-md p-3 shadow-lg">
          <p className="text-sm text-gray-900 font-medium mb-2">
            {formatDate(data.date)}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            Price: <span className="text-gray-900 font-medium">{formatPrice(data.price)}</span>
          </p>
          {data.insiderActivity && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className={`text-xs font-medium mb-1 ${
                data.insiderActivity.type === 'Buy' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                Insider {data.insiderActivity.type}
              </p>
              <p className="text-xs text-gray-600">
                {data.insiderActivity.insiderName}
              </p>
              <p className="text-xs text-gray-600">
                Value: {formatCurrency(data.insiderActivity.value)}
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
            tickFormatter={formatDate}
          />
          <YAxis 
            stroke="#9ca3af"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
            tickFormatter={formatPrice}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#3b82f6' }}
          />
          {data.map((point, index) => {
            if (point.insiderActivity) {
              return (
                <ReferenceDot
                  key={index}
                  x={point.date}
                  y={point.price}
                  r={5}
                  fill={point.insiderActivity.type === 'Buy' ? '#10b981' : '#ef4444'}
                  stroke={point.insiderActivity.type === 'Buy' ? '#065f46' : '#991b1b'}
                  strokeWidth={2}
                />
              );
            }
            return null;
          })}
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-6 mt-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-600 font-light">Buy Transaction</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs text-gray-600 font-light">Sell Transaction</span>
        </div>
      </div>
    </div>
  );
}