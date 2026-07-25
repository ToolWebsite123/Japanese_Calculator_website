import React from "react";

export function MathFraction({
  whole,
  num,
  den,
  sign,
}: {
  whole?: number | string;
  num: number | string;
  den: number | string;
  sign?: string;
}) {
  return (
    <span className="mx-1 inline-flex items-center align-middle text-lg">
      {sign && <span className="mr-1">{sign}</span>}
      {whole !== undefined && whole !== 0 && whole !== "" && (
        <span className="mr-1">{whole}</span>
      )}
      <span className="inline-flex flex-col items-center justify-center text-center leading-none">
        <span className="border-b-[1.5px] border-text-primary px-1 pb-[1px]">
          {num}
        </span>
        <span className="px-1 pt-[1px]">{den}</span>
      </span>
    </span>
  );
}

export function MathEq({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1 overflow-x-auto py-2 text-xl text-text-primary">
      {children}
    </div>
  );
}

export function MathOp({ op }: { op: string }) {
  return <span className="mx-2 font-medium">{op}</span>;
}

export function MathRadical({
  index,
  children,
}: {
  index?: number;
  children: React.ReactNode;
}) {
  return (
    <span className="mx-1 inline-flex items-center align-middle text-lg">
      {index !== undefined && index !== 2 && (
        <sup className="mr-0.5 text-xs font-medium">{index}</sup>
      )}
      <span className="text-2xl leading-none">√</span>
      <span className="border-t-[1.5px] border-text-primary pl-0.5">
        {children}
      </span>
    </span>
  );
}

export function MathSupFraction({
  num,
  den,
}: {
  num: number | string;
  den: number | string;
}) {
  return (
    <span className="inline-flex flex-col items-center justify-center text-center leading-none text-[0.7em]">
      <span className="border-b border-text-primary px-0.5 pb-px">{num}</span>
      <span className="px-0.5 pt-px">{den}</span>
    </span>
  );
}

type FractionExponent = { num: number | string; den: number | string };

type MathExponent =
  | number
  | string
  | React.ReactNode
  | FractionExponent
  | { factor: number | string; fraction: FractionExponent };

function isFractionExponent(value: unknown): value is FractionExponent {
  return (
    typeof value === "object" &&
    value !== null &&
    !React.isValidElement(value) &&
    "num" in value &&
    "den" in value &&
    !("factor" in value) &&
    !("fraction" in value)
  );
}

function isProductExponent(
  value: unknown
): value is { factor: number | string; fraction: FractionExponent } {
  return (
    typeof value === "object" &&
    value !== null &&
    !React.isValidElement(value) &&
    "factor" in value &&
    "fraction" in value
  );
}

function renderExponent(exponent: MathExponent): React.ReactNode {
  if (isFractionExponent(exponent)) {
    return <MathSupFraction num={exponent.num} den={exponent.den} />;
  }

  if (isProductExponent(exponent)) {
    return (
      <>
        {exponent.factor}
        <span className="mx-0.5">×</span>
        <MathSupFraction
          num={exponent.fraction.num}
          den={exponent.fraction.den}
        />
      </>
    );
  }

  return exponent;
}

export function MathPower({
  base,
  exponent,
}: {
  base: number | string | React.ReactNode;
  exponent: MathExponent;
}) {
  const groupedBase = React.isValidElement(base) ? <>{"("}{base}{")"}</> : base;

  return (
    <span className="mx-1 inline-flex items-baseline align-middle text-lg">
      <span>{groupedBase}</span>
      <sup className="ml-0.5 inline-flex items-baseline text-[0.65em] font-medium leading-none">
        {renderExponent(exponent)}
      </sup>
    </span>
  );
}
