import type { ReactNode } from "react";

type LegalPageLayoutProps = {
  title: string;
  description: string;
  lastUpdated?: string;
  children: ReactNode;
};

export function LegalPageLayout({
  title,
  description,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="rounded-[var(--radius-xl)] bg-[#231942]/[6%] p-1 dark:bg-[#231942]/30">
        <article className="rounded-[calc(var(--radius-xl)-0.15rem)] border border-[#231942]/20 bg-surface-raised p-6 sm:p-8 dark:border-[#231942]/40">
          <header className="border-b border-[#231942]/20 pb-6 dark:border-[#231942]/40">
            <h1 className="text-3xl font-bold tracking-tight text-[#231942] sm:text-4xl dark:text-[#d6ccf0]">
              {title}
            </h1>
            <div
              className="mt-4 h-1 w-16 rounded-full bg-[#231942] dark:bg-[#d6ccf0]"
              aria-hidden="true"
            />
            <p className="mt-4 text-sm leading-7 text-text-secondary sm:text-base">{description}</p>
            {lastUpdated && (
              <p className="mt-4 text-xs text-text-tertiary sm:text-sm">
                最終更新日: {lastUpdated}
              </p>
            )}
          </header>

          <div
            className={[
              "mt-8 space-y-8 text-sm leading-7 text-text-secondary sm:text-base",
              "[&_h2]:text-[#231942] dark:[&_h2]:text-[#d6ccf0]",
              "[&_a]:text-[#231942] [&_a]:underline-offset-4 hover:[&_a]:opacity-80 hover:[&_a]:underline",
              "dark:[&_a]:text-[#d6ccf0]",
            ].join(" ")}
          >
            {children}
          </div>
        </article>
      </div>
    </main>
  );
}
