"use client";

import { useState } from "react";
import { SurfacePanel } from "@/components/ui/primitives";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const name = String(formData.get("name") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const message = String(formData.get("message") ?? "").trim();

        if (!name || !email || !message) {
          setSubmitted(false);
          setError("すべての項目を入力してください。");
          return;
        }

        if (!emailPattern.test(email)) {
          setSubmitted(false);
          setError("メールアドレスの形式が正しくありません。");
          return;
        }

        setError(null);
        setSubmitted(true);
      }}
    >
      <div className="space-y-2">
        <label
          htmlFor="contact-name"
          className="text-sm font-medium text-text-secondary"
        >
          お名前
        </label>
        <input
          id="contact-name"
          name="name"
          autoComplete="name"
          required
          placeholder="山田 太郎"
          className={[
            "w-full min-h-11 rounded-[var(--radius-md)] border border-border",
            "bg-surface-sunken px-4 py-3 text-base text-text-primary outline-none transition",
            "focus:border-brand focus:ring-2 focus:ring-brand/20",
          ].join(" ")}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="contact-email"
          className="text-sm font-medium text-text-secondary"
        >
          メールアドレス
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="name@example.com"
          className={[
            "w-full min-h-11 rounded-[var(--radius-md)] border border-border",
            "bg-surface-sunken px-4 py-3 text-base text-text-primary outline-none transition",
            "focus:border-brand focus:ring-2 focus:ring-brand/20",
          ].join(" ")}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="contact-message"
          className="text-sm font-medium text-text-secondary"
        >
          お問い合わせ内容
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          placeholder="ご意見、ご質問、不具合の内容などをご記入ください。"
          className={[
            "w-full rounded-[var(--radius-md)] border border-border bg-surface-sunken",
            "px-4 py-3 text-base text-text-primary outline-none transition",
            "focus:border-brand focus:ring-2 focus:ring-brand/20",
          ].join(" ")}
        />
      </div>

      <button
        type="submit"
        className={[
          "btn-interactive min-h-11 w-full rounded-[var(--radius-md)]",
          "bg-brand py-3 text-sm font-semibold text-white",
          "hover:brightness-110",
        ].join(" ")}
      >
        送信する
      </button>

      <SurfacePanel className="space-y-2 text-sm leading-6 text-text-secondary">
        <p>
          現在、このフォームにはメール送信や外部フォーム連携は設定されていません。
        </p>
        <p>
          送信ボタンは画面上の入力動作を確認するためのもので、実際のメッセージ送信処理は今後の実装対象です。
        </p>
      </SurfacePanel>

      {error && <ErrorMessage message={error} />}
      {submitted && (
        <p role="alert" className="text-sm text-brand dark:text-[#d6ccf0]">
          現在は送信機能が未接続のため、メッセージはまだ送信されていません。
        </p>
      )}
    </form>
  );
}
