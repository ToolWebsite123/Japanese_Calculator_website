import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import ja from "@/lib/i18n/ja";

// Homepage FAQ (approved draft). Items come from ja.home.faqItems so
// the visible questions and the FAQPage JSON-LD always match exactly.
// The shared FAQ section carries no page container of its own (tool
// pages nest it inside theirs), so the homepage wraps it in the same
// max-w-6xl container as every other homepage section — without the
// wrapper it stretched edge to edge.
export function HomeFaq() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
      <div className="max-w-3xl">
        <CalculatorFaqSection title={ja.home.faqTitle} items={ja.home.faqItems} />
      </div>
    </div>
  );
}
