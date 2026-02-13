export default function ProductTable({ products, onEdit, onDisable }) {
    console.log("products///",products)
  return (
    <div className="bg-white rounded shadow">
      <table className="w-full text-sm">
       <thead className="bg-gray-50 text-gray-500 text-xs uppercase">

          <tr>
            <th className="text-left px-4 py-3">Name</th>
            <th className="text-left px-4 py-3">Price</th>
            <th className="text-left px-4 py-3">Stock</th>
            <th className="text-left px-4 py-3">Status</th>
            <th className="text-left px-4 py-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.name}</td>
              <td className="p-3">₹{p.sellingPrice}</td>
              <td className="p-3">{p.stockQuantity}</td>
              <td className="p-3">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                  Active
                </span>
              </td>
              <td className="p-3 space-x-3">
                <button
                  onClick={() => onEdit(p)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDisable(p)}
                  className="text-red-600 hover:underline"
                >
                  Disable
                </button>
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
