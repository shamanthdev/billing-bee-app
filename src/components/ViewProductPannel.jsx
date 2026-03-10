import { useEffect } from "react";
import { X } from "lucide-react";
import { dateViewFormating } from "../helper/helper";

export default function ViewProductPanel({ open, product, onClose }) {
  console.log("product",product)
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open || !product) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
      />

      {/* Panel */}
      <div
        className="
          fixed top-0 right-0 h-full w-[480px]
          bg-white dark:bg-[#0F172A]
          shadow-2xl z-50
          flex flex-col
          border-l border-gray-200 dark:border-gray-800
          animate-slideIn
        "
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#111827]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Product Details
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <X size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-sm">
          <Detail label="Product Name" value={product.name} />
          <Detail label="HSN Code" value={product.hsnCode || "—"} />

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
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111827] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700
                       transition font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-gray-200 dark:border-gray-800" />;
}
