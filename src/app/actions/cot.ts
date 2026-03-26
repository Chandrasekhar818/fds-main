"use server";

import { ServerClient } from "@/lib/supabase/server";

export async function fetchCotReports({
  market,
  fromDate,
  toDate,
}: {
  market: string;
  fromDate: string;
  toDate: string;
}) {
  const supabase = await ServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("cot_reports")
    .select("*")
    .eq("user_id", user.id)
    .eq("market", market)
    .gte("report_date", fromDate)
    .lte("report_date", toDate)
    .order("report_date", { ascending: true });
    if (error) throw error;



  return { data };
}


export async function fetchMarketOptions() {
  const supabase = await ServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

    const { data: markets, error: marketsError } = await supabase.rpc(
    "get_user_cot_markets",
    {
      p_user_id: user.id,
    },
  );

  if (marketsError) throw marketsError;
  return { data: markets };
}