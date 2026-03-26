"use server";

import { ServerClient } from "@/lib/supabase/server";

export type InsiderAnalyticsFilters = {
  ticker: string;
  fromDate: string;
  toDate: string;
};

export async function fetchInsiderDashboard(filters: InsiderAnalyticsFilters) {
  const supabase = await ServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc("get_insider_dashboard", {
    p_ticker: filters.ticker,
    p_from_date: filters.fromDate,
    p_to_date: filters.toDate,
    p_user_id: user?.id || null,
  });

  if (error) {
    console.error("fetchInsiderAnalytics error:", error);
    throw error;
  }

  return data;
}
export async function fetchUserCompanyOptions() {
  const supabase = await ServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase.rpc("get_user_company_options", {
    p_user_id: user?.id || null,
  });

  if (error) {
    console.error("fetchUserCompanyOptions error:", error);
    throw error;
  }

  return data;
}
