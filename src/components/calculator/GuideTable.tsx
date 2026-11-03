"use client";

/**
 * Static guide table used below the tax / percentage calculators
 * (head + string rows, first column emphasised). `wideCells` marks
 * long-text cells with data-wide so the mobile stacked layout puts
 * the label above the value instead of beside it — only the pages
 * that opt in get the attribute, exactly as before.
 */
export function GuideTable({
  head,
  rows,
  wideCells = false,
}: {
  head: string[];
  rows: string[][];
  wideCells?: boolean;
}) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm sm:text-base">
        <thead>
          <tr>
            {head.map((cell) => (
              <th
                key={cell}
                scope="col"
                className="border border-border bg-surface-sunken px-3 py-2 text-left font-semibold text-text-primary"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td
                  key={cell}
                  data-label={head[i]}
                  data-wide={wideCells && cell.length > 40 ? true : undefined}
                  className={`border border-border px-3 py-2 ${
                    i === 0 ? "font-medium text-text-primary" : "text-text-secondary"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
