import { getAlignClass } from "../helper/helper";

export default function DataTable({ columns, children, emptyText }) {
  return (
    <div className="bg-white border rounded-md overflow-hidden">
      <table className="w-full border-collapse table-fixed">
        <thead className="bg-gray-50 border-b">
          <tr>
            {columns.map((col) => (
              <th
                key={col.label}
                className={`
                  px-4 py-3
                  text-xs font-semibold text-gray-600 uppercase
                  ${getAlignClass(col.align)}
                `}
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
                className="text-center py-8 text-gray-500"
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

