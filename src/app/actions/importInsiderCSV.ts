"use server";

import { ServerClient } from "@/lib/supabase/server";
import Papa from "papaparse";
import { randomUUID } from "crypto";

const REQUIRED_COLUMNS = [
  "ticker",
  "company_name",
  "transaction_date",
  "insider_name",
  "insider_title",
  "transaction_type",
  "shares",
  "price",
  "value",
  "ownership_type",
  "filing_date",
  "source",
];

const BATCH_SIZE = 500;

export async function importInsiderCSV(file: File) {
  const supabase = await ServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error("User not authenticated");

  const text = await file.text();

  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });
  if (!parsed.data.length) throw new Error("CSV is empty");

  const rows = parsed.data as any[];
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
    .eq("user_id", user.id)          // ⭐ REQUIRED
    .in("ticker", Array.from(tickerSet));

  const existingTickerSet = new Set(
    existingCompanies?.map((c) => c.ticker) ?? []
  );


  const newCompaniesMap = new Map<
    string,
    { ticker: string; company_name: string; user_id: string }
  >();

  const validTrades: any[] = [];

  rows.forEach((row, index) => {
    try {
      const ticker = String(row.ticker ?? "").trim();
      const insiderName = String(row.insider_name ?? "").trim();
      const txDate = String(row.transaction_date ?? "").trim();

      if (!ticker || !insiderName || !txDate) {
        throw new Error(
          "Missing required fields (ticker, insider_name, transaction_date)"
        );
      }

      if (!existingTickerSet.has(ticker) && !newCompaniesMap.has(ticker)) {
        newCompaniesMap.set(ticker, {
          ticker,
          company_name: String(row.company_name ?? ticker).trim(),
          user_id: user.id,                 // ⭐ REQUIRED FIX
        });
      }

      const shares = Number(row.shares);
      const price = Number(row.price);
      const value = Number(row.value);

      if (isNaN(shares) || isNaN(price) || isNaN(value)) {
        throw new Error("Invalid numeric value in shares/price/value");
      }

      validTrades.push({
        id: randomUUID(),
        ticker,
        transaction_date: txDate,
        insider_name: insiderName,
        insider_title: row.insider_title
          ? String(row.insider_title).trim()
          : null,
        transaction_type: String(row.transaction_type ?? "").trim() || null,
        shares,
        price,
        value,
        ownership_type: row.ownership_type
          ? String(row.ownership_type).trim()
          : null,
        filing_date: row.filing_date
          ? String(row.filing_date).trim()
          : null,
        source: row.source ? String(row.source).trim() : null,
        user_id: user.id,               // required for FK
      });
    } catch (err: any) {
      skipped++;
      errors.push(`Row ${index + 1}: ${err.message || "Invalid data"}`);
    }
  });

  const newCompanies = Array.from(newCompaniesMap.values());

  if (newCompanies.length > 0) {
    const { error } = await supabase
      .from("companies")
      .insert(newCompanies);

    if (error) {
      throw new Error(`Failed to insert companies: ${error.message}`);
    }
  }


  for (let i = 0; i < validTrades.length; i += BATCH_SIZE) {
    const batch = validTrades.slice(i, i + BATCH_SIZE);

    const { error } = await supabase
      .from("insider_trades")
      .insert(batch);

    if (error) {
      errors.push(
        `Batch starting near row ${i + 2} failed: ${error.message}`
      );
      skipped += batch.length;
    } else {
      inserted += batch.length;
    }
  }

  const success = inserted > 0;

  return {
    success,
    inserted,
    skipped,
    newCompanies: newCompanies.length,
    message: success
      ? `Imported ${inserted} trades (${skipped} skipped)`
      : "No valid trades imported",
    errors: errors.slice(0, 15),
  };
}
