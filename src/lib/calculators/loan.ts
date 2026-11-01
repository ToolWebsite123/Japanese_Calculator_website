export type AmortizationRow = {
  period: number;
  label: string;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
};

export type LoanChartPoint = {
  period: number;
  label: string;
  balance: number;
};

export type RepaymentType = "equal_payment" | "equal_principal";

export type LoanResult = {
  repaymentType: RepaymentType;
  /** Level payment （元利均等） or first payment （元金均等）. */
  monthlyPayment: number;
  firstPayment: number;
  lastPayment: number;
  totalPayment: number;
  totalInterest: number;
  scheduleMode: "monthly" | "yearly";
  schedule: AmortizationRow[];
  chartPoints: LoanChartPoint[];
};

export function calculateLoan(
  principal: number,
  annualRatePercent: number,
  termYears: number,
  repaymentType: RepaymentType = "equal_payment",
): LoanResult {
  if (!Number.isFinite(principal) || principal <= 0) {
    throw new Error("借入額が無効です");
  }
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) {
    throw new Error("金利が無効です");
  }
  if (!Number.isFinite(termYears) || termYears <= 0) {
    throw new Error("返済期間が無効です");
  }

  const months = Math.round(termYears * 12);
  const monthlyRate = annualRatePercent / 100 / 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principal / months;
  } else {
    const factor = Math.pow(1 + monthlyRate, months);
    monthlyPayment = (principal * monthlyRate * factor) / (factor - 1);
  }

  monthlyPayment = Math.round(monthlyPayment);

  // 元金均等: the principal part is (nearly) constant; the payment shrinks
  // as the balance falls. Base principal is rounded, final month adjusts.
  const basePrincipal = Math.round(principal / months);

  const monthlySchedule: AmortizationRow[] = [];
  let balance = principal;
  let totalPayment = 0;
  let firstPayment = 0;
  let lastPayment = 0;

  for (let month = 1; month <= months; month++) {
    const interest = Math.round(balance * monthlyRate);
    let principalPart: number;
    let payment: number;

    if (repaymentType === "equal_principal") {
      principalPart = month === months ? balance : Math.min(basePrincipal, balance);
      payment = principalPart + interest;
    } else {
      principalPart = monthlyPayment - interest;
      payment = monthlyPayment;
      if (month === months || principalPart > balance) {
        principalPart = balance;
        payment = principalPart + interest;
      }
    }

    balance = Math.max(0, balance - principalPart);
    totalPayment += payment;
    if (month === 1) firstPayment = payment;
    lastPayment = payment;

    monthlySchedule.push({
      period: month,
      label: `${month}回`,
      payment,
      interest,
      principal: principalPart,
      balance,
    });

    if (balance === 0) break;
  }

  if (repaymentType === "equal_principal") {
    monthlyPayment = firstPayment;
  }

  const scheduleMode = months <= 120 ? "monthly" : "yearly";
  const schedule =
    scheduleMode === "monthly" ? monthlySchedule : summarizeYearlySchedule(monthlySchedule);
  const chartPoints = schedule.map((row) => ({
    period: row.period,
    label: row.label,
    balance: row.balance,
  }));

  return {
    repaymentType,
    monthlyPayment,
    firstPayment,
    lastPayment,
    totalPayment,
    totalInterest: totalPayment - principal,
    schedule,
    scheduleMode,
    chartPoints,
  };
}

function summarizeYearlySchedule(rows: AmortizationRow[]): AmortizationRow[] {
  const summary: AmortizationRow[] = [];

  for (let i = 0; i < rows.length; i += 12) {
    const chunk = rows.slice(i, i + 12);
    const year = Math.floor(i / 12) + 1;

    summary.push({
      period: year,
      label: `${year}年目`,
      payment: chunk.reduce((sum, row) => sum + row.payment, 0),
      interest: chunk.reduce((sum, row) => sum + row.interest, 0),
      principal: chunk.reduce((sum, row) => sum + row.principal, 0),
      balance: chunk.at(-1)?.balance ?? 0,
    });
  }

  return summary;
}
