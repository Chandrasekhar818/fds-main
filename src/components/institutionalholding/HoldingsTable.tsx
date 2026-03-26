"use client";

import { InstitutionalHolding } from "@/app/actions/holdings";

export default function HoldingsTable({
  data,
}: {
  data: InstitutionalHolding[];
}) {
  if (!data?.length) {
    return (
      <div className="p-8 text-center text-gray-500 text-sm">
        No institutional holdings data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th scope="col" className="px-3 py-3 text-left font-medium text-gray-700 whitespace-nowrap">
              Fund
            </th>
            <th scope="col" className="px-3 py-3 text-right font-medium text-gray-700 whitespace-nowrap">
              Shares
            </th>
            <th scope="col" className="px-3 py-3 text-right font-medium text-gray-700 whitespace-nowrap">
              Value ($)
            </th>
            <th scope="col" className="px-3 py-3 text-right font-medium text-gray-700 whitespace-nowrap hidden sm:table-cell">
              Weight %
            </th>
            <th scope="col" className="px-3 py-3 text-center font-medium text-gray-700 whitespace-nowrap">
              Qtr
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-3 font-medium text-gray-900 max-w-[180px] truncate">
                {row.fund_name}
              </td>
              <td className="px-3 py-3 text-right text-gray-700">
                {row.shares.toLocaleString()}
              </td>
              <td className="px-3 py-3 text-right font-medium text-gray-900">
                ${row.value.toLocaleString()}
              </td>
              <td className="px-3 py-3 text-right text-gray-700 hidden sm:table-cell">
                {row.weight.toFixed(2)}%
              </td>
              <td className="px-3 py-3 text-center text-gray-600">
                {row.quarter}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}