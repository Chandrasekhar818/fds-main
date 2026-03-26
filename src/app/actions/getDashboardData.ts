"use server";

import { ServerClient } from "@/lib/supabase/server";
import { SmartMoneyDashboardResponse } from "@/types/dashboard";

export async function fetchDashboard() {
  const supabase = await ServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error("User not authenticated");
  const { data, error } = await supabase.rpc("get_smart_money_dashboard", {
    p_user_id: user.id,
  });

  if (error) throw error;

  return data as SmartMoneyDashboardResponse;
}
