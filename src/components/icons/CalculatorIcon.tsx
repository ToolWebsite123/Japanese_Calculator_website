import { Calculator, LayoutGrid, type LucideProps } from "lucide-react";

export function CalculatorIcon({ className, ...props }: LucideProps) {
  return <Calculator className={className} aria-hidden="true" {...props} />;
}

export function CategoryIcon({ className, ...props }: LucideProps) {
  return <LayoutGrid className={className} aria-hidden="true" {...props} />;
}
