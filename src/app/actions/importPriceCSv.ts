"use server";

import { ServerClient } from "@/lib/supabase/server";
import Papa from "papaparse";
import { randomUUID } from "crypto";

const REQUIRED_COLUMNS = [
  "ticker",
  "company_name",
  "date",
  "open",
  "high",
  "low",
  "close",
  "volume",
  "adjusted_close",
];

const BATCH_SIZE = 500;

export async function importPriceCSV(file: File) {
  const supabase = await ServerClient();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("User not authenticated");

  const text = await file.text();
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  const rows = parsed.data as any[];
  if (!rows.length) throw new Error("CSV is empty");

  const columns = Object.keys(rows[0]);
  for (const col of REQUIRED_COLUMNS) {
    if (!columns.includes(col)) {
      throw new Error(`Missing required column: ${col}`);
    }
  }

  let inserted = 0;
  let skipped = 0;
  const errors: string[] = [];

  const tickerSet = new Set<string>(
    rows.map((r) => String(r.ticker ?? "").trim()).filter(Boolean)
  );

  const { data: existingCompanies } = await supabase
    .from("companies")
    .select("ticker")
    .eq("user_id", user.id)
    .in("ticker", Array.from(tickerSet));

  const existingTickerSet = new Set(
    existingCompanies?.map((c) => c.ticker) ?? []
  );

  const newCompaniesMap = new Map<string, { ticker: string; company_name: string; user_id: string }>();
  const validRows: any[] = [];

  rows.forEach((row, index) => {
    try {
      const ticker = String(row.ticker ?? "").trim();
      const company_name = String(row.company_name ?? "").trim();
      const date = String(row.date ?? "").trim();

      if (!ticker || !date) {
        throw new Error("Missing required fields: ticker or date");
      }

      if (!company_name) {
        throw new Error("company_name is required, skipping row");
      }

      if (!existingTickerSet.has(ticker) && !newCompaniesMap.has(ticker)) {
        newCompaniesMap.set(ticker, {
          ticker,
          company_name,
          user_id: user.id,
        });
      }

      const open = Number(row.open);
      const high = Number(row.high);
      const low = Number(row.low);
      const close = Number(row.close);
      const volume = Number(row.volume);
      const adjusted_close = row.adjusted_close ? Number(row.adjusted_close) : null;

      if ([open, high, low, close, volume].some((n) => isNaN(n))) {
        throw new Error("Invalid numeric value in open/high/low/close/volume");
      }

      validRows.push({
        id: randomUUID(),
        ticker,
        date,
        open,
        high,
        low,
        close,
        volume,
        adjusted_close,
        user_id: user.id,
      });
    } catch (err: any) {
      skipped++;
      errors.push(`Row ${index + 1}: ${err.message || "Invalid data"}`);
    }
  });

  const newCompanies = Array.from(newCompaniesMap.values());
  if (newCompanies.length > 0) {
    const { error } = await supabase.from("companies").insert(newCompanies);
    if (error) throw new Error(`Failed to insert companies: ${error.message}`);
  }

  for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
    const batch = validRows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("price_data").insert(batch);
    if (error) {
      errors.push(`Batch starting near row ${i + 2} failed: ${error.message}`);
      skipped += batch.length;
    } else {
      inserted += batch.length;
    }
  }

  return {
    success: inserted > 0,
    inserted,
    skipped,
    newCompanies: newCompanies.length,
    message: inserted > 0
      ? `Imported ${inserted} rows (${skipped} skipped)`
      : "No valid rows imported",
    errors: errors.slice(0, 15),
  };
}
