/**
 * Compound interest with an optional monthly contribution （積立）.
 *
 * The principal compounds at the selected frequency (yearly / monthly /
 * daily), exactly as the calculator has always done. Monthly
 * contributions are modelled as end-of-month payments compounding
 * monthly at annualRate / 12 — the standard assumption of Japanese
 * 積立 simulators — and are stated on the page.
 */
export type CompoundInterestInput = {
  principal: number;
  annualRatePercent: number;
  years: number;
  frequency: number; // compounding periods per year for the principal
  monthlyContribution?: number;
};

export type CompoundYearRow = {
  year: number;
  contributed: number; // principal + contributions paid in so far
  futureValue: number;
  interest: number;
};

export type CompoundInterestResult = {
  futureValue: number;
  principalFutureValue: number;
  contributionFutureValue: number;
  totalContributions: number; // principal + all monthly contributions
  totalInterest: number; // futureValue - totalContributions
  yearly: CompoundYearRow[]; // one row per whole year, capped at 50
};

function futureValueAt(input: CompoundInterestInput, years: number): Omit<CompoundInterestResult, "yearly"> {
  const { principal, annualRatePercent, frequency } = input;
  const monthlyContribution = input.monthlyContribution ?? 0;
  const r = annualRatePercent / 100;

  const principalFutureValue = principal * Math.pow(1 + r / frequency, frequency * years);

  const periods = 12 * years;
  const monthlyRate = r / 12;
  const contributionFutureValue =
    monthlyContribution <= 0
      ? 0
      : monthlyRate === 0
        ? monthlyContribution * periods
        : monthlyContribution * ((Math.pow(1 + monthlyRate, periods) - 1) / monthlyRate);

  const futureValue = principalFutureValue + contributionFutureValue;
  const totalContributions = principal + monthlyContribution * periods;

  return {
    futureValue,
    principalFutureValue,
    contributionFutureValue,
    totalContributions,
    totalInterest: futureValue - totalContributions,
  };
}

export function calcCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const total = futureValueAt(input, input.years);
  const wholeYears = Math.min(Math.floor(input.years), 50);
  const yearly: CompoundYearRow[] = [];
  for (let y = 1; y <= wholeYears; y++) {
    const at = futureValueAt(input, y);
    yearly.push({
      year: y,
      contributed: at.totalContributions,
      futureValue: at.futureValue,
      interest: at.totalInterest,
    });
  }
  return { ...total, yearly };
}
