"use server";

import { getPriceData } from "@/services/allservies";
import { ServerClient } from "@/lib/supabase/server";

export type PriceRow = {
  id: string;
  ticker: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjusted_close?: number;
  created_at?: string;
  company_name?: string;
};


export type PriceDataFilters = {
  ticker?: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
};

export async function fetchPriceData(
  filters: PriceDataFilters = {}
): Promise<PriceRow[]> {
  const ticker = filters.ticker ?? "TICK000";

  try {
    const data = await getPriceData({
      ticker,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      limit: filters.limit ?? 1000,
    });

    return data ?? [];
  } catch (error) {
    console.error("Failed to fetch price data:", error);
    return [];
  }
}

export async function getUniqueTickers(): Promise<
  { ticker: string; name: string }[]
> {
  const supabase = await ServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("User not authenticated");
    return [];
  }

  const { data, error } = await supabase
    .from("price_data")
    .select(`
      ticker,
      companies (
        company_name
      )
    `)
    .eq("user_id", user.id)
    .order("ticker", { ascending: true });

  if (error) {
    console.error("Failed to fetch tickers:", error);
    return [];
  }

  // Remove duplicates
  const seen = new Set<string>();

  const companies = (data ?? [])
    .filter((row: any) => {
      if (!row.ticker || seen.has(row.ticker)) return false;
      seen.add(row.ticker);
      return true;
    })
    .map((row: any) => ({
      ticker: row.ticker,
      name: row.companies?.company_name ?? row.ticker,
    }));

  return companies;
}
