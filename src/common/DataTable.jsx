import clsx from "clsx";

export default function DataTable({
  columns,
  children,
  emptyText,
}) {
  return (
    <div className="bg-surface dark:bg-surfaceDark border border-borderLight dark:border-borderDark rounded-xl overflow-hidden shadow-soft">

      <table className="w-full text-sm">

        <thead className="bg-gray-50 dark:bg-[#1f1f1f] text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          <tr>
            {columns.map((col) => (
              <th
                key={col.label}
                className={clsx(
                  "px-4 py-3",
                    col.align === "left" && "text-left",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                  !col.align && "text-left"
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {children && children.length > 0 ? (
            children
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-12 text-gray-500 dark:text-gray-400"
              >
                {emptyText || "No data found"}
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  );
}