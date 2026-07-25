import { linkify } from "@/components/calculator/LinkedText";
import { useRouterState } from "@tanstack/react-router";

type HowToStep = {
  title: string;
  body: string;
};

type CalculatorHowToSectionProps = {
  title: string;
  steps: HowToStep[];
};

export function CalculatorHowToSection({
  title,
  steps,
}: CalculatorHowToSectionProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <section
      aria-labelledby="calculator-howto-heading"
      className="mt-16 border-t border-border pt-16"
    >
      <h2
        id="calculator-howto-heading"
        className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
      >
        {title}
      </h2>
      <ol className="mt-8 space-y-6">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-4">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-muted text-sm font-bold text-brand"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="text-base font-semibold text-[#231942] sm:text-lg dark:text-[#d6ccf0]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">
                {linkify(step.body, pathname)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
