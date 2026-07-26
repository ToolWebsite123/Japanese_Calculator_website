"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { ChipButton } from "@/components/ui/primitives";

type CopyResultButtonProps = {
  value: string;
  className?: string;
};

export function CopyResultButton({ value, className = "" }: CopyResultButtonProps) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!value || value === t.common.error || value === "0") return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be unavailable
    }
  }

  return (
    <ChipButton
      onClick={handleCopy}
      active={copied}
      className={className}
      aria-label={t.common.copy}
    >
      <span className="inline-flex items-center gap-1.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-3.5 w-3.5"
          aria-hidden
        >
          <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
          <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
        </svg>
        {copied ? t.common.copied : t.common.copy}
      </span>
    </ChipButton>
  );
}
