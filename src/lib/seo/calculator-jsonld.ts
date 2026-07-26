type FaqItem = {
  question: string;
  answer: string;
};

export function buildCalculatorFaqJsonLd(faqItems: FaqItem[], pageTitle: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: pageTitle,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
