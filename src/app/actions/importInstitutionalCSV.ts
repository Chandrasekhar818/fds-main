'use server';

import { ServerClient } from '@/lib/supabase/server';
import Papa from 'papaparse';
import { randomUUID } from 'crypto';

const REQUIRED_COLUMNS = [
  'fund_name',
  'ticker',
  'cusip',
  'shares',
  'value',
  'weight',
  'quarter',
  'reported_date',
  'company_name',
];

const BATCH_SIZE = 500;

export async function importInstitutionalCSV(file: File) {
  const supabase = await ServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message: 'User not authenticated',
    };
  }

  const text = await file.text();

  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (!parsed.data.length) {
    return {
      success: false,
      message: 'CSV is empty',
    };
  }

  const rows = parsed.data as any[];
  const columns = Object.keys(rows[0]);

  for (const col of REQUIRED_COLUMNS) {
    if (!columns.includes(col)) {
      return {
        success: false,
        message: `Missing required column: ${col}`,
      };
    }
  }

  let inserted = 0;
  let skipped = 0;
  const errors: string[] = [];

  const tickerSet = new Set<string>(
    rows
      .map((r) => String(r.ticker ?? '').trim().toUpperCase())
      .filter(Boolean)
  );

  const { data: existingCompanies } = await supabase
    .from('companies')
    .select('ticker')
    .eq('user_id', user.id)               
    .in('ticker', Array.from(tickerSet));

  const existingTickerSet = new Set(
    existingCompanies?.map((c) => c.ticker) ?? []
  );

  const newCompaniesMap = new Map<
    string,
    { ticker: string; company_name: string; user_id: string }
  >();

  const validHoldings: any[] = [];

  rows.forEach((row, index) => {
    try {
      const ticker = String(row.ticker ?? '').trim().toUpperCase();
      const fundName = String(row.fund_name ?? '').trim();

      if (!ticker || !fundName) {
        throw new Error('Missing required fields (ticker or fund_name)');
      }

      if (!existingTickerSet.has(ticker) && !newCompaniesMap.has(ticker)) {
        newCompaniesMap.set(ticker, {
          ticker,
          company_name: String(row.company_name ?? ticker).trim() || ticker,
          user_id: user.id,                         
        });
      }

      const shares = Number(row.shares);
      const value = Number(row.value);
      const weight = Number(row.weight);

      if (isNaN(shares) || isNaN(value) || isNaN(weight)) {
        throw new Error('Invalid numeric value in shares/value/weight');
      }

      validHoldings.push({
        id: randomUUID(),
        fund_name: fundName,
        ticker,
        cusip: row.cusip ? String(row.cusip).trim() : null,
        shares,
        value,
        weight,
        quarter: row.quarter ? String(row.quarter).trim() : null,
        reported_date: row.reported_date ? String(row.reported_date).trim() : null,
        user_id: user.id,                            
        created_at: new Date().toISOString(),
      });
    } catch (err: any) {
      skipped++;
      errors.push(`Row ${index + 2}: ${err.message || 'Invalid data'}`);
    }
  });
  
    const newCompanies = Array.from(newCompaniesMap.values());

  if (newCompanies.length > 0) {
    const { error } = await supabase.from('companies').insert(newCompanies);

    if (error) {
      return {
        success: false,
        message: `Failed to insert new companies: ${error.message}`,
        errors: [error.message],
      };
    }
  }

  for (let i = 0; i < validHoldings.length; i += BATCH_SIZE) {
    const batch = validHoldings.slice(i, i + BATCH_SIZE);

    const { error } = await supabase
      .from('institutional_holdings')
      .insert(batch);

    if (error) {
      errors.push(`Batch insert failed (rows ~${i + 2}): ${error.message}`);
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
      ? `Successfully imported ${inserted} institutional holdings (${skipped} skipped)`
      : 'No valid holdings were imported.',
    errors: errors.slice(0, 15),
  };
}