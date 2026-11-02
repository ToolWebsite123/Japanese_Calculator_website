import Script from "next/script";
import { FAQ as CharacterCounterFaq } from "@/components/calculators/CharacterCounter";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { CharacterCounter } from "@/components/calculators/CharacterCounter";

export default function CharacterCounterPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(CharacterCounterFaq.items, "文字数計算機");

  return (
    <>
      <Script
        id="character-counter-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <CharacterCounter />
    </>
  );
}
