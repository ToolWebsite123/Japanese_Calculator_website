"use client";

import { useLocale } from "@/context/LocaleContext";

export function HomeIntroSection() {
  const { t } = useLocale();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8">
        <p className="text-sm font-medium tracking-wide text-brand">
          {t.home.heroEyebrow}
        </p>
        <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl lg:text-4xl dark:text-[#d6ccf0]">
          {t.home.heroTitle}
        </h1>
      </div>

      <h2 className="text-xl font-bold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
        {t.home.introTitle}
      </h2>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        {t.home.introParagraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
