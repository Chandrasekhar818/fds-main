"use server";

import { getInstitutionalHoldings } from "@/services/allservies";
export type InstitutionalHolding = {
  id: string;
  fund_name: string;
  ticker: string;
  cusip: string;
  shares: number;
  value: number;
  weight: number;
  quarter: string;         // "2024-Q3"
  reported_date: string;   // date
  created_at: string;
};


export async function fetchInstitutionalHoldings() {
  try {
    const data = await getInstitutionalHoldings();
    return data;
  } catch (error) {
    console.error("Failed to fetch institutional holdings", error);
    throw new Error("Failed to fetch institutional holdings");
  }
}
