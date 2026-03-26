'use client';

import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';

interface Transaction {
  id: string;
  insiderName: string;
  role: string;
  type: 'Buy' | 'Sell';
  shares: number;
  price: number;
  totalValue: number;
  date: string;
}

export function TransactionsTable({ data }: { data: Transaction[] }) {
  const [sortBy, setSortBy] = useState<'date' | 'value'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  const sortedData = [...data].sort((a, b) => {
    if (sortBy === 'date') {
      const comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      return sortOrder === 'desc' ? comparison : -comparison;
    } else {
      const comparison = b.totalValue - a.totalValue;
      return sortOrder === 'desc' ? comparison : -comparison;
    }
  });

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (column: 'date' | 'value') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatShares = (shares: number) => {
    return new Intl.NumberFormat('en-US').format(shares);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 tracking-wide uppercase">
              Insider Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 tracking-wide uppercase">
              Role
            </th>
            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 tracking-wide uppercase">
              Type
            </th>
            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 tracking-wide uppercase">
              Shares
            </th>
            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 tracking-wide uppercase">
              Price
            </th>
            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 tracking-wide uppercase">
              <button
                onClick={() => handleSort('value')}
                className="flex items-center gap-1 ml-auto hover:text-gray-700 transition-colors"
              >
                Total Value
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 tracking-wide uppercase">
              <button
                onClick={() => handleSort('date')}
                className="flex items-center gap-1 ml-auto hover:text-gray-700 transition-colors"
              >
                Date
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((transaction) => (
            <tr 
              key={transaction.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 text-sm text-gray-900 font-light">
                {transaction.insiderName}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 font-light">
                {transaction.role}
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium ${
                  transaction.type === 'Buy' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {transaction.type}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 font-light text-right tabular-nums">
                {formatShares(transaction.shares)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 font-light text-right tabular-nums">
                ${transaction.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium text-right tabular-nums">
                {formatCurrency(transaction.totalValue)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 font-light text-right">
                {formatDate(transaction.date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center px-6 py-4">
        <span className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-800 disabled:opacity-40 hover:bg-gray-300 transition-colors rounded-sm"
          >
            Prev
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-800 disabled:opacity-40 hover:bg-gray-300 transition-colors rounded-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}