import Script from "next/script";
import { FAQ as FurusatoNozeiSimulatorFaq } from "@/components/calculators/FurusatoNozeiSimulator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { FurusatoNozeiSimulator } from "@/components/calculators/FurusatoNozeiSimulator";
import { metaTitle } from "@/ported-pages/furusato-nozei-simulation-calculation/metadata";



export default function FurusatoNozeiSimulationCalculationPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    FurusatoNozeiSimulatorFaq.items,
    metaTitle,
  );

  return (
    <>
      <Script
        id="furusato-nozei-simulation-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FurusatoNozeiSimulator />
    </>
  );
}
