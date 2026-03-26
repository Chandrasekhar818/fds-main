import { DateRangeOptions } from "@/types/cot";

export type DateRangeOption = "30d" | "90d" | "6m" | "1y" | "2y";

export function getDateRange(range: DateRangeOption) {
  const now = new Date();
  const from = new Date(now);

  switch (range) {
    case "30d":
      from.setDate(now.getDate() - 30);
      break;

    case "90d":
      from.setDate(now.getDate() - 90);
      break;

    case "6m":
      from.setMonth(now.getMonth() - 6);
      break;

    case "1y":
      from.setFullYear(now.getFullYear() - 1);
      break;
    
    case "2y":
      from.setFullYear(now.getFullYear() - 2);
      break;

    default:
      from.setDate(now.getDate() - 90);
  }

  return {
    fromDate: from.toISOString().split("T")[0],
    toDate: now.toISOString().split("T")[0],
  };
}



export function getCotDateRange(range: string) {
  const now = new Date();
  const from = new Date(now);

  switch (range) {
    case "8w":
      from.setDate(now.getDate() - 56);
      break;
    case "26w":
      from.setDate(now.getDate() - 182);
      break;
    case "52w":
      from.setDate(now.getDate() - 365);
      break;
    case "all":
    default:
      from.setFullYear(now.getFullYear() - 20);
  }

  return {
    fromDate: from.toISOString().split("T")[0],
    toDate: now.toISOString().split("T")[0],
  };
}


 export const formatCurrency = (value: number|undefined, tofix: number = 0) => {
    if (value === undefined || value === null) {
      return 'N/A';
    }
    const absValue = Math.abs(value);
    if (absValue >= 1e6) return `$${(value / 1e6).toFixed(tofix)}M`;
    if (absValue >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };


export const DATE_RANGE_OPTIONS: DateRangeOptions[] = [
  { value: '30d', label: '30 Days' },
  { value: '60d', label: '60 Days' },
  { value: '6m', label: '6 Months' },
  { value: '1y', label: '1 Year' },
];
