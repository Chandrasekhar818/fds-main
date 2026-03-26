'use server';

import { ServerClient } from '@/lib/supabase/server';
import Papa from 'papaparse';
import { randomUUID } from 'crypto';

const REQUIRED_COLUMNS = [
  'market',
  'report_date',
  'commercial_long',
  'commercial_short',
  'speculator_long',
  'speculator_short',
  'open_interest',
];

const BATCH_SIZE = 500;

export async function importCotCSV(file: File) {
  const supabase = await ServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: 'User not authenticated' };
  }

  const text = await file.text();

  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (!parsed.data.length) {
    return { success: false, message: 'CSV is empty' };
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

  const validRows: any[] = [];

  rows.forEach((row, index) => {
    try {
      const market = String(row.market ?? '').trim();
      const report_date = String(row.report_date ?? '').trim();

      if (!market || !report_date) {
        throw new Error('Missing market or report_date');
      }

      const commercial_long = Number(row.commercial_long);
      const commercial_short = Number(row.commercial_short);
      const speculator_long = Number(row.speculator_long);
      const speculator_short = Number(row.speculator_short);
      const open_interest = Number(row.open_interest);

      if (
        [
          commercial_long,
          commercial_short,
          speculator_long,
          speculator_short,
          open_interest,
        ].some(isNaN)
      ) {
        throw new Error('Invalid numeric values');
      }

      validRows.push({
        id: randomUUID(),
        market,
        report_date,
        commercial_long,
        commercial_short,
        commercial_net: commercial_long - commercial_short,
        speculator_long,
        speculator_short,
        speculator_net: speculator_long - speculator_short,
        open_interest,
        user_id: user.id,
        created_at: new Date().toISOString(),
      });
    } catch (err: any) {
      skipped++;
      errors.push(`Row ${index + 2}: ${err.message}`);
    }
  });

  for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
    const batch = validRows.slice(i, i + BATCH_SIZE);

    const { error } = await supabase
      .from('cot_reports')
      .upsert(batch, {
        onConflict: 'user_id,market,report_date',
      });

    if (error) {
      skipped += batch.length;
      errors.push(error.message);
    } else {
      inserted += batch.length;
    }
  }

  return {
    success: inserted > 0,
    inserted,
    skipped,
    message:
      inserted > 0
        ? `Imported ${inserted} records`
        : 'No valid records inserted',
    errors: errors.slice(0, 10),
  };
}
