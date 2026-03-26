"use server";

import { getInsiderTrades } from "@/services/allservies";

export type InsiderTradeFilters = {
  ticker?: string;
  type?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
};

export async function fetchInsiderTrades(filters: InsiderTradeFilters = {}) {
  const { ticker, type, fromDate, toDate, page = 1, limit = 50 } = filters;

  const data = await getInsiderTrades({
    ticker,
    type,
    fromDate,
    toDate,
    page,
    limit,
  });

  return data;
}
