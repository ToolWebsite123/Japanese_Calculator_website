"use client";

import { useLocale } from "@/context/LocaleContext";

export function HomeFaqSection() {
  const { t } = useLocale();

  return (
    <section aria-labelledby="faq-heading" className="mt-16 border-t border-border pt-16">
      <h2
        id="faq-heading"
        className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
      >
        {t.home.faqTitle}
      </h2>
      <dl className="mt-8 space-y-8">
        {t.home.faqItems.map((item, index) => (
          <div key={index}>
            <dt>
              <h3 className="text-base font-semibold text-[#231942] sm:text-lg dark:text-[#d6ccf0]">
                {item.question}
              </h3>
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
