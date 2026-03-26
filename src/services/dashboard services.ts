import { ServerClient} from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await ServerClient();

  const { count: insiderCount } = await supabase
    .from("insider_trades")
    .select("*", { count: "exact", head: true });

  const { count: holdingsCount } = await supabase
    .from("institutional_holdings")
    .select("*", { count: "exact", head: true });

  const { count: cotCount } = await supabase
    .from("cot_reports")
    .select("*", { count: "exact", head: true });

  return {
    insiderCount: insiderCount ?? 0,
    holdingsCount: holdingsCount ?? 0,
    cotCount: cotCount ?? 0,
  };
}
