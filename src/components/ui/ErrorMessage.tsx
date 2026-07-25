export function ErrorMessage({
  message,
  id,
}: {
  message: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      role="alert"
      className="rounded-[var(--radius-md)] border border-brand/20 bg-brand-muted px-4 py-3 text-sm text-brand"
    >
      {message}
    </div>
  );
}
