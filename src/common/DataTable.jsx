import clsx from "clsx";

export default function DataTable({
  columns,
  children,
  emptyText,
  noScroll = false,
}) {
  return (
    <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-md shadow-sm">

      {/* SCROLL ONLY WHEN NEEDED */}
      <div className={noScroll ? "" : "w-full overflow-x-auto pb-2 rounded-md"}>

        <table
          className={clsx(
            "w-full text-sm table-auto border-collapse ",
            !noScroll && "min-w-[1000px]"
          )}
        >
          {/* HEADER */}
          <thead className="bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 ">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.label}
                  className={clsx(
                    "px-5 py-3 text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase whitespace-nowrap",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    (!col.align || col.align === "left") && "text-left"
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
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
    </div>
  );
}