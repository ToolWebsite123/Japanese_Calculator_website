import type { ButtonGuideRow } from "@/lib/calculator-guides/types";

type ButtonGuideTableProps = {
  title: string;
  rows: ButtonGuideRow[];
};

export function ButtonGuideTable({ title, rows }: ButtonGuideTableProps) {
  return (
    <section aria-labelledby="button-guide-heading" className="mt-10">
      <h2
        id="button-guide-heading"
        className="text-xl font-bold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]"
      >
        {title}
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-sunken">
              <th className="px-3 py-2.5 text-left font-semibold text-text-primary">ボタン</th>
              <th className="px-3 py-2.5 text-left font-semibold text-text-primary">機能説明</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-border last:border-b-0">
                <td className="px-3 py-2.5 whitespace-nowrap font-medium text-text-primary">
                  {row.button}
                </td>
                <td className="px-3 py-2.5 text-text-secondary">{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
