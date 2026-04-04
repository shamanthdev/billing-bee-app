import { Eye, Pencil, Trash2 } from "lucide-react";
import DataTable from "../common/DataTable";

export default function ProductTable({ products, onEdit, onDisable, onView }) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center text-gray-500">
        No products found
      </div>
    );
  }

  return (
    <DataTable
      columns={[
        { label: "Product ID", align: "left" },
        { label: "Product", align: "left" },
        { label: "Price", align: "right" },
        { label: "Stock", align: "center" },
        { label: "GST %", align: "center" },
        { label: "Expiry", align: "center" },
        { label: "Actions", align: "center" },
      ]}
      emptyText="No products found"
    >
      {products.map((p) => (
        <tr
          key={p.id}
          className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition"
        >
          <td className="px-5 py-3 font-medium whitespace-nowrap">{p.sku}</td>
          <td className="px-5 py-3">{p.name}</td>

          <td className="px-5 py-3 text-right text-yellow-600 font-semibold">
            ₹{p.sellingPrice}
          </td>

          <td className="px-5 py-3 text-center">
            {p.stockQuantity}
            {p.stockQuantity <= 10 && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                LOW
              </span>
            )}
          </td>

          <td className="px-5 py-3 text-center">{p.taxPercent}%</td>
          <td className="px-5 py-3 text-center whitespace-nowrap">{p.expiryDate}</td>

          <td className="px-5 py-3 flex justify-center gap-4">
            <Eye size={16} className="cursor-pointer hover:text-blue-500" onClick={() => onView(p)} />
            <Pencil size={16} className="cursor-pointer hover:text-yellow-500" onClick={() => onEdit(p)} />
            <Trash2 size={16} className="cursor-pointer hover:text-red-500" onClick={() => onDisable(p)} />
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
