import DataTable from "../common/DataTable";
import { dateViewFormating } from "../helper/helper";

export default function ProductTable({
  products,
  onEdit,
  onDisable,
  onView,
}) {
  return (
    <DataTable
      columns={[
        { label: "Product", align: "left" },
        { label: "Price", align: "right" },
        { label: "Stock", align: "center" },
        { label: "GST %", align: "center" },
        { label: "Expiry", align: "center" },
        { label: "Actions", align: "center" },
      ]}
      emptyText="No products found"
    >
      {products.map((product) => (
        <tr
          key={product.id}
          className="border-b last:border-b-0 hover:bg-gray-50"
        >
          <td className="px-4 py-3 text-sm font-medium text-left">
            {product.name}
          </td>

          <td className="px-4 py-3 text-sm font-medium text-right">
            ₹{product.sellingPrice}
          </td>

          <td className="px-4 py-3 text-sm text-center">
            <div className="flex flex-col items-center leading-tight">
              <span className="font-medium">
                {product.stockQuantity}
              </span>

              {product.stockQuantity > 0 &&
                product.stockQuantity <= 10 && (
                  <span className="mt-1 text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                    LOW STOCK
                  </span>
                )}

              {product.stockQuantity === 0 && (
                <span className="mt-1 text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded">
                  OUT OF STOCK
                </span>
              )}
            </div>
          </td>

          <td className="px-4 py-3 text-sm text-center">
            {product.taxPercent
              ? `${product.taxPercent}%`
              : "-"}
          </td>

          <td className="px-4 py-3 text-sm text-center text-gray-500">
            {dateViewFormating(product.expiryDate) || "—"}
          </td>

          <td className="px-4 py-3 text-sm text-center space-x-3">
            <button
              onClick={() => onView(product)}
              className="text-gray-700 hover:underline"
            >
              View
            </button>
            <button
              onClick={() => onEdit(product)}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => onDisable(product)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
