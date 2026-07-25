"use client";

import { useLocale } from "@/context/LocaleContext";

export function HomeTrustSection() {
  const { t } = useLocale();

  return (
    <section className="mt-16 border-t border-border pt-16">
      <h2 className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]">
        {t.home.trustTitle}
      </h2>
      <p className="mt-6 text-sm leading-relaxed text-text-secondary sm:text-base">
        {t.home.trustText}
      </p>
    </section>
  );
}
