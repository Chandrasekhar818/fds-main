'use client';

import { formatCurrency } from '@/lib/utils/date-range';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ActivityData {
  role: string;
  buyValue: number;
  sellValue: number;
}

export function InsiderActivityChart({ data }: { data: ActivityData[] }) {

  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis 
            dataKey="role" 
            stroke="#9ca3af"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            stroke="#9ca3af"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              padding: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ color: '#1f2937', fontSize: 13, fontWeight: 600, marginBottom: 8 }}
            itemStyle={{ color: '#4b5563', fontSize: 12 }}
            formatter={formatCurrency}
          />
          <Bar dataKey="buyValue" name="Buy Value" radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`buy-${index}`} fill="#10b981" />  
            ))}
          </Bar>
          <Bar dataKey="sellValue" name="Sell Value" radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`sell-${index}`} fill="#ef4444" />  
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}