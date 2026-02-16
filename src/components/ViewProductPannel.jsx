import { dateViewFormating, Detail, Divider } from "../helper/helper";
export default function ViewProductPanel({ open, product, onClose }) {
  console.log("product////", product, open);
  if (!open || !product) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40" />

      {/* Side Panel */}
      <div className="fixed top-0 right-0 h-full w-[420px] bg-white z-50 shadow-lg flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Product Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-4 text-sm space-y-4">
          <Detail label="Name" value={product.name} />
          <Detail label="HSN Code" value={product.hsnCode} />

          <Divider />

          <Detail label="Cost Price" value={`₹${product.costPrice || 0}`} />
          <Detail
            label="Selling Price"
            value={`₹${product.sellingPrice || 0}`}
          />
          <Detail label="GST %" value={`${product.taxPercent || 0}%`} />

          <Divider />

          <Detail label="Stock Quantity" value={product.stockQuantity || 0} />

          <Detail
            label="Expiry Date"
            value={
              product.expiryDate ? dateViewFormating(product.expiryDate) : "—"
            }
          />

          <Detail
            label="Status"
            value={
              product.active ? (
                <span className="text-green-600 font-medium">Active</span>
              ) : (
                <span className="text-red-500 font-medium">Inactive</span>
              )
            }
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
