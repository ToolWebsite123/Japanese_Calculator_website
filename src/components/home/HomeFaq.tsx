import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import ja from "@/lib/i18n/ja";

// Homepage FAQ (approved draft). Items come from ja.home.faqItems so
// the visible questions and the FAQPage JSON-LD always match exactly.
export function HomeFaq() {
  return <CalculatorFaqSection title={ja.home.faqTitle} items={ja.home.faqItems} />;
}
