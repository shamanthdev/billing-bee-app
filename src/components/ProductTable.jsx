import { dateViewFormating } from "../helper/helper";

export default function ProductTable({ products, onEdit, onDisable, onView }) {
  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
          <tr>
            <th className="text-left px-4 py-3">Product</th>
            <th className="text-right px-4 py-3">Price</th>
            <th className="text-center px-4 py-3">Stock</th>
            <th className="text-center px-4 py-3">GST %</th>
            <th className="text-center px-4 py-3">Expiry</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-8 text-gray-500">
                No products found
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                {/* Name */}
                <td className="px-4 py-3 font-medium">{product.name}</td>

                {/* Selling Price */}
                <td className="px-4 py-2 text-right font-medium">
                  ₹{product.sellingPrice}
                </td>

                {/* Stock */}
                <td className="px-4 py-2 text-center">
                  <div className="flex flex-col items-center leading-tight">
                    <span className="font-medium">{product.stockQuantity}</span>

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

                {/* GST */}
                <td className="px-4 py-2 text-center">
                  {product.taxPercent ? `${product.taxPercent}%` : "-"}
                </td>

                {/* Expiry */}
                <td className="px-4 py-2 text-center text-gray-500 text-sm">
                  {dateViewFormating(product.expiryDate) || "—"}
                </td>

                {/* Actions  */}
                <td className="px-4 py-3 text-center space-x-3">
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
