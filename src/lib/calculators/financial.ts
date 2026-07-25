export type TvmSolveTarget = "PV" | "FV" | "PMT" | "IY" | "N";

export type TvmInputs = {
  pv: number;
  fv: number;
  pmt: number;
  ratePercent: number;
  periods: number;
};

export type TvmResult = {
  target: TvmSolveTarget;
  solvedValue: number;
  totalPayments: number;
  interestDifference: number;
};

function assertFinite(name: string, value: number) {
  if (!Number.isFinite(value)) {
    throw new Error(`${name}が無効です`);
  }
}

function growthFactor(ratePercent: number, periods: number): number {
  const i = ratePercent / 100;
  if (Math.abs(i) < 1e-12) {
    return 1;
  }
  return Math.pow(1 + i, periods);
}

function annuityFactor(ratePercent: number, periods: number): number {
  const i = ratePercent / 100;
  if (periods <= 0) {
    throw new Error("期間数が無効です");
  }
  if (Math.abs(i) < 1e-12) {
    return periods;
  }
  return (Math.pow(1 + i, periods) - 1) / i;
}

/** FV = PV*(1+i)^n + PMT*((1+i)^n - 1)/i */
export function tvmFutureValue(
  pv: number,
  pmt: number,
  ratePercent: number,
  periods: number
): number {
  const gf = growthFactor(ratePercent, periods);
  const af = annuityFactor(ratePercent, periods);
  return pv * gf + pmt * af;
}

function solvePresentValue(
  fv: number,
  pmt: number,
  ratePercent: number,
  periods: number
): number {
  const gf = growthFactor(ratePercent, periods);
  const af = annuityFactor(ratePercent, periods);
  if (Math.abs(gf) < 1e-12) {
    throw new Error("現在価値を計算できません");
  }
  return (fv - pmt * af) / gf;
}

function solvePayment(
  pv: number,
  fv: number,
  ratePercent: number,
  periods: number
): number {
  const af = annuityFactor(ratePercent, periods);
  if (Math.abs(af) < 1e-12) {
    throw new Error("定期支払額を計算できません");
  }
  const gf = growthFactor(ratePercent, periods);
  return (fv - pv * gf) / af;
}

function solvePeriods(
  pv: number,
  fv: number,
  pmt: number,
  ratePercent: number
): number {
  const i = ratePercent / 100;

  if (Math.abs(pmt) < 1e-12 && Math.abs(pv) < 1e-12) {
    throw new Error("期間数を計算できません");
  }

  if (Math.abs(i) < 1e-12) {
    if (Math.abs(pmt) < 1e-12) {
      throw new Error("期間数を計算できません");
    }
    const n = (fv - pv) / pmt;
    if (n <= 0 || !Number.isFinite(n)) {
      throw new Error("期間数を計算できません");
    }
    return n;
  }

  if (Math.abs(pmt) < 1e-12 && pv > 0 && fv > 0) {
    const n = Math.log(fv / pv) / Math.log(1 + i);
    if (n <= 0 || !Number.isFinite(n)) {
      throw new Error("期間数を計算できません");
    }
    return n;
  }

  let lo = 1e-6;
  let hi = 1_000_000;
  const target = fv;

  for (let iter = 0; iter < 200; iter++) {
    const mid = (lo + hi) / 2;
    const value = tvmFutureValue(pv, pmt, ratePercent, mid);
    if (Math.abs(value - target) < 1e-8) {
      return mid;
    }
    if (value < target) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  throw new Error("期間数を計算できません");
}

function solveRatePercent(
  pv: number,
  fv: number,
  pmt: number,
  periods: number
): number {
  if (periods <= 0) {
    throw new Error("期間数が無効です");
  }

  let lo = -99.99;
  let hi = 1000;
  const target = fv;

  for (let iter = 0; iter < 200; iter++) {
    const mid = (lo + hi) / 2;
    let value: number;
    try {
      value = tvmFutureValue(pv, pmt, mid, periods);
    } catch {
      lo = mid;
      continue;
    }

    if (Math.abs(value - target) < 1e-6) {
      return mid;
    }
    if (value < target) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  throw new Error("利率を計算できません");
}

export function solveTimeValueOfMoney(
  target: TvmSolveTarget,
  inputs: TvmInputs
): TvmResult {
  const { pv, fv, pmt, ratePercent, periods } = inputs;

  assertFinite("PV", pv);
  assertFinite("FV", fv);
  assertFinite("PMT", pmt);
  assertFinite("利率", ratePercent);
  assertFinite("期間数", periods);

  let solvedValue: number;

  switch (target) {
    case "PV":
      solvedValue = solvePresentValue(fv, pmt, ratePercent, periods);
      break;
    case "FV":
      solvedValue = tvmFutureValue(pv, pmt, ratePercent, periods);
      break;
    case "PMT":
      solvedValue = solvePayment(pv, fv, ratePercent, periods);
      break;
    case "IY":
      solvedValue = solveRatePercent(pv, fv, pmt, periods);
      break;
    case "N":
      solvedValue = solvePeriods(pv, fv, pmt, ratePercent);
      break;
    default:
      throw new Error("不明な計算項目です");
  }

  const effectivePeriods = target === "N" ? solvedValue : periods;
  const effectivePv = target === "PV" ? solvedValue : pv;
  const effectivePmt = target === "PMT" ? solvedValue : pmt;
  const effectiveFv = target === "FV" ? solvedValue : fv;

  const totalPayments = Math.abs(effectivePmt) * effectivePeriods;
  const interestDifference = effectiveFv - effectivePv - totalPayments;

  return {
    target,
    solvedValue,
    totalPayments,
    interestDifference,
  };
}
