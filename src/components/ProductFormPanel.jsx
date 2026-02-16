import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createProduct, updateProduct } from "../services/ProductService";

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
    sellingPrice: "",
    costPrice: "",
    stockQuantity: "",
    gstPercent: "18",
    hsnCode: "",
    expiryDate: "",
  });

  /* ---------------- Populate form on edit ---------------- */
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        sellingPrice: product.sellingPrice || "",
        costPrice: product.costPrice || "",
        stockQuantity: product.stockQuantity || "",
        gstPercent: product.taxPercent ?? "18",
        hsnCode: product.hsnCode || "",
        expiryDate: product.expiryDate || "",
      });
    }
  }, [product]);

  /* ---------------- Change handler ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = async () => {
    const {
      name,
      sellingPrice,
      costPrice,
      stockQuantity,
      gstPercent,
      hsnCode,
    } = form;

    if (
      !name ||
      !sellingPrice ||
      !costPrice ||
      !stockQuantity ||
      !gstPercent ||
      !hsnCode
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      name,
      sellingPrice: Number(sellingPrice),
      costPrice: Number(costPrice),
      stockQuantity: Number(stockQuantity),
      taxPercent: Number(gstPercent),
      hsnCode,
      expiryDate: form.expiryDate || null,
    };

    try {
      setLoading(true);
      isEdit ? await updateProduct(product.id, payload)
             : await createProduct(payload);

      toast.success(
        isEdit ? "Product updated successfully" : "Product added successfully"
      );

      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Failed to save product");
      console.error(err);
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
        className="fixed inset-0 bg-black/40 z-40"
      />

      {/* Side Panel */}
      <div className="fixed top-0 right-0 h-full w-[420px] bg-white z-50 shadow-lg flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-4 space-y-4 text-sm">

          {/* Product Name */}
          <div>
            <label className="block mb-1 font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* HSN Code */}
          <div>
            <label className="block mb-1 font-medium">
              HSN Code <span className="text-red-500">*</span>
            </label>
            <input
              name="hsnCode"
              value={form.hsnCode}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-medium">
                Cost Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="costPrice"
                value={form.costPrice}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Selling Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="sellingPrice"
                value={form.sellingPrice}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* GST + Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-medium">
                GST % <span className="text-red-500">*</span>
              </label>
              <select
                name="gstPercent"
                value={form.gstPercent}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Stock Qty <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                name="stockQuantity"
                value={form.stockQuantity}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block mb-1 font-medium">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-yellow-400 rounded font-medium
              disabled:opacity-40"
          >
            {loading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
          </button>
        </div>
      </div>
    </>
  );
}
