import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createProduct, updateProduct } from "../services/ProductService";
import { X } from "lucide-react";

export default function ProductFormPanel({
  open,
  onClose,
  onSuccess,
  product,
}) {
  const isEdit = Boolean(product);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    productCode: "",
    sellingPrice: "",
    costPrice: "",
    stockQuantity: "",
    gstPercent: "18",
    hsnCode: "",
    expiryDate: "",
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        sku: product.productCode || "",
        sellingPrice: product.sellingPrice || "",
        costPrice: product.costPrice || "",
        stockQuantity: product.stockQuantity || "",
        gstPercent: product.taxPercent ?? "18",
        hsnCode: product.hsnCode || "",
        expiryDate: product.expiryDate || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const {
      name,
      sellingPrice,
      costPrice,
      stockQuantity,
      gstPercent,
      hsnCode,
      productCode,
    } = form;

    if (
      !name ||
      !sellingPrice ||
      !costPrice ||
      !stockQuantity ||
      !gstPercent 
     
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      name,
      sku: productCode || "",
      sellingPrice: Number(sellingPrice),
      costPrice: Number(costPrice),
      stockQuantity: Number(stockQuantity),
      taxPercent: Number(gstPercent),
      hsnCode,
      expiryDate: form.expiryDate || null,
    };

    try {
      setLoading(true);
      isEdit
        ? await updateProduct(product.id, payload)
        : await createProduct(payload);

      toast.success(
        isEdit ? "Product updated successfully" : "Product added successfully",
      );

      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`
    fixed inset-0 bg-black/50 backdrop-blur-sm z-40
    transition-opacity duration-300
    ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
  `}
      />

      {/* Slide Panel */}
      <div
        className={`
    fixed top-0 right-0 h-full w-[520px]
    bg-white dark:bg-[#141414]
    border-l border-gray-200 dark:border-gray-800
    shadow-2xl z-50 flex flex-col
    transform transition-transform duration-300 ease-in-out
    ${open ? "translate-x-0" : "translate-x-full"}
  `}
      >
        {/* Header */}
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="
              p-2 rounded-lg
              text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-[#1f1f1f]
              hover:text-gray-800 dark:hover:text-white
              hover:scale-105 active:scale-95
              transition duration-200
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-6 space-y-7 text-sm">
          {/* Name */}
          <div>
            <label className="block mb-1 text-gray-600 dark:text-gray-400">
              Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="
  w-full rounded-lg px-4 py-2.5 text-sm
  bg-gray-50 dark:bg-[#1c1c1c]
  border border-gray-300 dark:border-gray-700
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
  transition duration-200
  hover:border-gray-400 dark:hover:border-gray-600
"
            />
          </div>

            {/* HSN */}
          <div>
            <label className="block mb-1 text-gray-600 dark:text-gray-400">
            Product Code (Optional)
            </label>
            <input
              name="productCode"
              value={form.productCode}
              onChange={handleChange}
              className="
  w-full rounded-lg px-4 py-2.5 text-sm
  bg-gray-50 dark:bg-[#1c1c1c]
  border border-gray-300 dark:border-gray-700
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
  transition duration-200
  hover:border-gray-400 dark:hover:border-gray-600
"
            />
          </div>

          {/* HSN */}
          <div>
            <label className="block mb-1 text-gray-600 dark:text-gray-400">
              HSN Code (Optional)
            </label>
            <input
              name="hsnCode"
              value={form.hsnCode}
              onChange={handleChange}
              className="
  w-full rounded-lg px-4 py-2.5 text-sm
  bg-gray-50 dark:bg-[#1c1c1c]
  border border-gray-300 dark:border-gray-700
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
  transition duration-200
  hover:border-gray-400 dark:hover:border-gray-600
"
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-600 dark:text-gray-400">
                Purchase Price *
              </label>
              <input
                type="number"
                name="costPrice"
                value={form.costPrice}
                onChange={handleChange}
                className="
  w-full rounded-lg px-4 py-2.5 text-sm
  bg-gray-50 dark:bg-[#1c1c1c]
  border border-gray-300 dark:border-gray-700
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
  transition duration-200
  hover:border-gray-400 dark:hover:border-gray-600
"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600 dark:text-gray-400">
                Selling Price *
              </label>
              <input
                type="number"
                name="sellingPrice"
                value={form.sellingPrice}
                onChange={handleChange}
                className="
  w-full rounded-lg px-4 py-2.5 text-sm
  bg-gray-50 dark:bg-[#1c1c1c]
  border border-gray-300 dark:border-gray-700
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
  transition duration-200
  hover:border-gray-400 dark:hover:border-gray-600
"
              />
            </div>
          </div>

          {/* GST + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-600 dark:text-gray-400">
                GST %
              </label>
              <select
                name="gstPercent"
                value={form.gstPercent}
                onChange={handleChange}
                className="
  w-full rounded-lg px-4 py-2.5 text-sm
  bg-gray-50 dark:bg-[#1c1c1c]
  border border-gray-300 dark:border-gray-700
  focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
  transition duration-200
"
              >
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-gray-600 dark:text-gray-400">
                Stock Qty *
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={form.stockQuantity}
                onChange={handleChange}
                className="
  w-full rounded-lg px-4 py-2.5 text-sm
  bg-gray-50 dark:bg-[#1c1c1c]
  border border-gray-300 dark:border-gray-700
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
  transition duration-200
  hover:border-gray-400 dark:hover:border-gray-600
"
              />
            </div>
          </div>

          {/* Expiry */}
          <div>
            <label className="block mb-1 text-gray-600 dark:text-gray-400">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate || ""}
              onChange={handleChange}
              className="
  w-full rounded-lg px-4 py-2.5 text-sm
  bg-gray-50 dark:bg-[#1c1c1c]
  border border-gray-300 dark:border-gray-700
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
  transition duration-200
  hover:border-gray-400 dark:hover:border-gray-600
"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="
  px-5 py-2.5 rounded-lg border
  border-gray-300 dark:border-gray-700
  hover:bg-gray-100 dark:hover:bg-[#1f1f1f]
  transition
"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
  px-5 py-2.5 rounded-lg bg-primary hover:bg-primaryHover
  text-black font-semibold shadow-md hover:shadow-lg
  transition duration-200 disabled:opacity-50
"
          >
            {loading ? "Saving..." : isEdit ? "Confirm" : "Save"}
          </button>
        </div>
      </div>
    </>
  );
}
