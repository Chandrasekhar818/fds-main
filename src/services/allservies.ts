import { ServerClient } from "@/lib/supabase/server";

type InsiderFilters = {
  ticker?: string;
  type?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
};

export async function getInsiderTrades(filters: InsiderFilters = {}) {
  const supabase = await ServerClient();

  const { ticker, type, fromDate, toDate, page = 1, limit = 50 } = filters;

  let query = supabase
    .from("insider_trades")
    .select("*")
    .order("transaction_date", { ascending: false });
    

  if (ticker) query = query.eq("ticker", ticker); 
  if (type) query = query.eq("transaction_type", type);
  if (fromDate) query = query.gte("transaction_date", fromDate);
  if (toDate) query = query.lte("transaction_date", toDate);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await query.range(from, to);

  if (error) throw error;
  return data ?? [];
}

type HoldingsFilters = {
  ticker?: string;
  quarter?: string;
  limit?: number;
};

export async function getInstitutionalHoldings(filters: HoldingsFilters = {}) {
  const supabase = await ServerClient();
  const { data: { user },
  } = await supabase.auth.getUser();  
  const { ticker, quarter, limit = 200 } = filters;

  let query = supabase
    .from("institutional_holdings")
    .select("*")
    .eq("user_id", user?.id)
    .order("value", { ascending: false });

  if (ticker) query = query.eq("ticker", ticker);
  if (quarter) query = query.eq("quarter", quarter);

  const { data, error } = await query.limit(limit);

  if (error) throw error;
  return data ?? [];
}



type COTFilters = {
  market?: string;
  page?: number;
  limit?: number;
};


type PriceFilters = {
  ticker: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
};

export async function getPriceData({
  ticker,
  fromDate,
  toDate,
  limit = 1000,
}: PriceFilters) {

  const supabase = await ServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  let query = supabase
    .from("price_data")
    .select(`
      id,
      ticker,
      date,
      open,
      high,
      low,
      close,
      volume,
      adjusted_close,
      created_at,
      companies (
        company_name
      )
    `)
    .eq("user_id", user.id)
    .eq("ticker", ticker)
    .order("date", { ascending: true });

  if (fromDate) {
    query = query.gte("date", fromDate);
  }

  if (toDate) {
    query = query.lte("date", toDate);
  }

  query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    ticker: row.ticker,
    date: row.date,
    open: row.open,
    high: row.high,
    low: row.low,
    close: row.close,
    volume: row.volume,
    adjusted_close: row.adjusted_close,
    created_at: row.created_at,
    company_name: row.companies?.company_name ?? row.ticker,
  }));
}
