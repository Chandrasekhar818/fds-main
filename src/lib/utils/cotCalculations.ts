import { CotKPIs, CotSignal, SignalStrength } from "@/types/cot";

export function deriveKpis(rows: any[]): CotKPIs {
  if (rows.length < 2) {
    const r = rows[0] ?? {
      commercial_net: 0,
      speculator_net: 0,
      open_interest: 0,
    };

    return {
      commercial_net: r.commercial_net,
      speculator_net: r.speculator_net,
      open_interest: r.open_interest,
      weekly_change_pct: 0,
    };
  }

  const last = rows[rows.length - 1];
  const prev = rows[rows.length - 2];

  const weekly_change_pct =
    prev.open_interest === 0
      ? 0
      : ((last.open_interest - prev.open_interest) / prev.open_interest) * 100;

  return {
    commercial_net: last.commercial_net,
    speculator_net: last.speculator_net,
    open_interest: last.open_interest,
    weekly_change_pct,
  };
}

export function deriveSignal(
  net: number,
  nets: number[]
): SignalStrength {
  const sorted = [...nets].sort((a, b) => a - b);
  const rank = sorted.filter((v) => v <= net).length;
  const pct = (rank / sorted.length) * 100;

  if (pct >= 90) return "Extremely Bullish";
  if (pct >= 65) return "Bullish";
  if (pct <= 10) return "Extremely Bearish";
  if (pct <= 35) return "Bearish";
  return "Neutral";
}

export function deriveSignals(rows: any[]): CotSignal[] {
  if (!rows.length) return [];

  const last = rows[rows.length - 1];
  const commNets = rows.map((r) => r.commercial_net);
  const specNets = rows.map((r) => r.speculator_net);

  const commNet = last.commercial_net;
  const specNet = last.speculator_net;

  const commPct =
    (commNets.filter((v) => v <= commNet).length / commNets.length) * 100;

  const specPct =
    (specNets.filter((v) => v <= specNet).length / specNets.length) * 100;

  return [
    {
      actor: "Commercials",
      signal: deriveSignal(commNet, commNets),
      net_position: commNet,
      percentile: commPct,
    },
    {
      actor: "Speculators",
      signal: deriveSignal(specNet, specNets),
      net_position: specNet,
      percentile: specPct,
    },
  ];
}
