import type { ReactNode } from "react";
import { linkify } from "@/components/calculator/LinkedText";
import { useRouterState } from "@tanstack/react-router";

type FaqItem = {
  question: string;
  answer: string | ReactNode;
};

type CalculatorFaqSectionProps = {
  title: string;
  items: FaqItem[];
};

export function CalculatorFaqSection({ title, items }: CalculatorFaqSectionProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <section
      aria-labelledby="calculator-faq-heading"
      className="mt-16 border-t border-border pt-16"
    >
      <h2
        id="calculator-faq-heading"
        className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
      >
        {title}
      </h2>
      <dl className="mt-8 space-y-8">
        {items.map((item, index) => (
          <div key={index}>
            <dt>
              <h3 className="text-base font-semibold text-[#231942] sm:text-lg dark:text-[#d6ccf0]">
                {item.question}
              </h3>
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">
              {typeof item.answer === "string" ? linkify(item.answer, pathname) : item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
