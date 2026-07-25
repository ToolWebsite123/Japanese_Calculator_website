export type Seat = "dealer" | "nondealer";
export type WinType = "ron" | "tsumo";

export type MahjongInput = {
  han: number;
  fu: number;
  seat: Seat;
  win: WinType;
};

export type MahjongResult = {
  total: number;
  label: string; // e.g. 満貫, 跳満, etc. or ""
  breakdown: string;
  basePoints: number | null; // null when fixed table used
};

const ceil100 = (n: number) => Math.ceil(n / 100) * 100;

type Fixed = {
  label: string;
  dealerRon: number;
  dealerTsumoEach: number;
  nonDealerRon: number;
  nonDealerTsumoDealer: number;
  nonDealerTsumoOther: number;
};

const FIXED: Array<{ min: number; max: number; f: Fixed }> = [
  { min: 5, max: 5, f: { label: "満貫", dealerRon: 12000, dealerTsumoEach: 4000, nonDealerRon: 8000, nonDealerTsumoDealer: 4000, nonDealerTsumoOther: 2000 } },
  { min: 6, max: 7, f: { label: "跳満", dealerRon: 18000, dealerTsumoEach: 6000, nonDealerRon: 12000, nonDealerTsumoDealer: 6000, nonDealerTsumoOther: 3000 } },
  { min: 8, max: 10, f: { label: "倍満", dealerRon: 24000, dealerTsumoEach: 8000, nonDealerRon: 16000, nonDealerTsumoDealer: 8000, nonDealerTsumoOther: 4000 } },
  { min: 11, max: 12, f: { label: "三倍満", dealerRon: 36000, dealerTsumoEach: 12000, nonDealerRon: 24000, nonDealerTsumoDealer: 12000, nonDealerTsumoOther: 6000 } },
  { min: 13, max: Infinity, f: { label: "役満", dealerRon: 48000, dealerTsumoEach: 16000, nonDealerRon: 32000, nonDealerTsumoDealer: 16000, nonDealerTsumoOther: 8000 } },
];

function fixedFor(han: number): Fixed | null {
  for (const row of FIXED) if (han >= row.min && han <= row.max) return row.f;
  return null;
}

function fromFixed(f: Fixed, input: MahjongInput): MahjongResult {
  if (input.seat === "dealer") {
    if (input.win === "ron") {
      return { total: f.dealerRon, label: f.label, basePoints: null, breakdown: `放銃者から ${f.dealerRon.toLocaleString()}点` };
    }
    const total = f.dealerTsumoEach * 3;
    return { total, label: f.label, basePoints: null, breakdown: `子3人が各 ${f.dealerTsumoEach.toLocaleString()}点 (合計 ${total.toLocaleString()}点)` };
  }
  if (input.win === "ron") {
    return { total: f.nonDealerRon, label: f.label, basePoints: null, breakdown: `放銃者から ${f.nonDealerRon.toLocaleString()}点` };
  }
  const total = f.nonDealerTsumoDealer + f.nonDealerTsumoOther * 2;
  return {
    total,
    label: f.label,
    basePoints: null,
    breakdown: `親 ${f.nonDealerTsumoDealer.toLocaleString()}点 + 子2人 各${f.nonDealerTsumoOther.toLocaleString()}点 (合計 ${total.toLocaleString()}点)`,
  };
}

export function calcMahjong(input: MahjongInput): MahjongResult {
  const { han, fu, seat, win } = input;
  if (han >= 5) return fromFixed(fixedFor(han)!, input);

  const rawBase = fu * Math.pow(2, 2 + han);
  // If han 3-4 pushes base over 2000, treat as mangan
  if (rawBase > 2000) return fromFixed(fixedFor(5)!, input);

  const base = Math.min(rawBase, 2000);

  if (seat === "dealer") {
    if (win === "ron") {
      const total = ceil100(base * 6);
      return { total, label: "", basePoints: base, breakdown: `基本点 ${base} × 6 = ${(base * 6).toLocaleString()} → 100点単位切り上げ ${total.toLocaleString()}点` };
    }
    const each = ceil100(base * 2);
    const total = each * 3;
    return { total, label: "", basePoints: base, breakdown: `子3人が各 ${each.toLocaleString()}点 (基本点 ${base} × 2 = ${(base * 2).toLocaleString()} → 切り上げ), 合計 ${total.toLocaleString()}点` };
  }

  if (win === "ron") {
    const total = ceil100(base * 4);
    return { total, label: "", basePoints: base, breakdown: `基本点 ${base} × 4 = ${(base * 4).toLocaleString()} → 100点単位切り上げ ${total.toLocaleString()}点` };
  }
  const dealerPay = ceil100(base * 2);
  const otherPay = ceil100(base * 1);
  const total = dealerPay + otherPay * 2;
  return {
    total,
    label: "",
    basePoints: base,
    breakdown: `親 ${dealerPay.toLocaleString()}点 (基本点 ${base} × 2 切り上げ) + 子2人 各${otherPay.toLocaleString()}点 (基本点 ${base} × 1 切り上げ), 合計 ${total.toLocaleString()}点`,
  };
}

// ---- Fu builder ----

export type WinMethod = "menzenRon" | "tsumo" | "openRon";
export type WaitType = "kanchanPenchanTanki" | "ryanmenShanpon";
export type PairType = "yakuhai" | "doubleYakuhai" | "other";

export type MeldTileType = "simple" | "terminalHonor";
export type MeldShape = "openTriplet" | "closedTriplet" | "openKan" | "closedKan" | "none";

export type MeldInput = { tile: MeldTileType; shape: MeldShape };

export const MELD_FU: Record<MeldTileType, Record<Exclude<MeldShape, "none">, number>> = {
  simple: { openTriplet: 2, closedTriplet: 4, openKan: 8, closedKan: 16 },
  terminalHonor: { openTriplet: 4, closedTriplet: 8, openKan: 16, closedKan: 32 },
};

export type FuBuilderInput = {
  method: WinMethod;
  wait: WaitType;
  pair: PairType;
  melds: MeldInput[];
};

export function buildFu(input: FuBuilderInput): { total: number; rounded: number; parts: Array<{ label: string; value: number }> } {
  const parts: Array<{ label: string; value: number }> = [{ label: "副底", value: 20 }];
  const methodFu = input.method === "menzenRon" ? 10 : input.method === "tsumo" ? 2 : 0;
  if (methodFu) parts.push({ label: input.method === "menzenRon" ? "門前ロン" : "ツモ", value: methodFu });
  const waitFu = input.wait === "kanchanPenchanTanki" ? 2 : 0;
  if (waitFu) parts.push({ label: "待ち (カンチャン/ペンチャン/単騎)", value: waitFu });
  const pairFu = input.pair === "yakuhai" ? 2 : input.pair === "doubleYakuhai" ? 4 : 0;
  if (pairFu) parts.push({ label: input.pair === "doubleYakuhai" ? "対子 (ダブル役牌)" : "対子 (役牌)", value: pairFu });
  input.melds.forEach((m, i) => {
    if (m.shape === "none") return;
    const v = MELD_FU[m.tile][m.shape];
    parts.push({ label: `面子${i + 1}`, value: v });
  });
  const total = parts.reduce((s, p) => s + p.value, 0);
  const rounded = total === 20 ? 20 : Math.ceil(total / 10) * 10;
  return { total, rounded, parts };
}
