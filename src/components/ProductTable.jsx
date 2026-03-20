import { Eye, Pencil, Trash2 } from "lucide-react";

export default function ProductTable({ products, onEdit, onDisable, onView }) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center text-gray-500">
        No products found
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-xs">
          <tr>
            <th className="px-6 py-4 text-left">Product ID</th>
            <th className="px-6 py-4 text-left">Product</th>
            <th className="px-6 py-4 text-right">Price</th>
            <th className="px-6 py-4 text-center">Stock</th>
            <th className="px-6 py-4 text-center">GST %</th>
            <th className="px-6 py-4 text-center">Expiry</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr
              key={p.id}
              className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <td className="px-6 py-4 font-medium">{p.sku}</td>
              <td className="px-6 py-4 font-medium">{p.name}</td>

              <td className="px-6 py-4 text-right text-yellow-600 font-semibold">
                ₹{p.sellingPrice}
              </td>

              <td className="px-6 py-4 text-center">
                {p.stockQuantity}
                {p.stockQuantity <= 10 && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                    LOW STOCK
                  </span>
                )}
              </td>

              <td className="px-6 py-4 text-center">{p.taxPercent}%</td>

              <td className="px-6 py-4 text-center">{p.expiryDate}</td>

              <td className="px-6 py-4 flex justify-center gap-4 text-gray-500">
                <Eye
                  size={16}
                  className="hover:text-blue-500 cursor-pointer"
                  onClick={() => onView(p)}
                />
                <Pencil
                  size={16}
                  className="hover:text-yellow-500 cursor-pointer"
                  onClick={() => onEdit(p)}
                />
                <Trash2
                  size={16}
                  className="hover:text-red-500 cursor-pointer"
                  onClick={() => onDisable(p)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
