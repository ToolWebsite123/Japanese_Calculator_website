import Script from "next/script";
import { FAQ as TsuboFaq } from "@/components/calculators/TsuboConverter";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { TsuboConverter } from "@/components/calculators/TsuboConverter";

export default function TsuboConverterPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(TsuboFaq.items, "坪・畳・㎡変換計算機");

  return (
    <>
      <Script
        id="tsubo-converter-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <TsuboConverter />
    </>
  );
}
