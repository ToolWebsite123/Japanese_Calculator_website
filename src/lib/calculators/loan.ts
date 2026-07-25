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

export type LoanResult = {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  scheduleMode: "monthly" | "yearly";
  schedule: AmortizationRow[];
  chartPoints: LoanChartPoint[];
};

export function calculateLoan(
  principal: number,
  annualRatePercent: number,
  termYears: number
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

  const monthlySchedule: AmortizationRow[] = [];
  let balance = principal;
  let totalPayment = 0;

  for (let month = 1; month <= months; month++) {
    const interest = Math.round(balance * monthlyRate);
    let principalPart = monthlyPayment - interest;
    let payment = monthlyPayment;

    if (month === months || principalPart > balance) {
      principalPart = balance;
      payment = principalPart + interest;
    }

    balance = Math.max(0, balance - principalPart);
    totalPayment += payment;

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

  const scheduleMode = months < 60 ? "monthly" : "yearly";
  const schedule =
    scheduleMode === "monthly"
      ? monthlySchedule
      : summarizeYearlySchedule(monthlySchedule);
  const chartPoints = schedule.map((row) => ({
    period: row.period,
    label: row.label,
    balance: row.balance,
  }));

  return {
    monthlyPayment,
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
