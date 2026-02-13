import { useEffect, useRef, useState } from "react";
import { createProduct, updateProduct } from "../services/ProductService";

export default function ProductFormPanel({
  open,
  onClose,
  onSuccess,
  product,
}) {
  const isEdit = Boolean(product);

  const [form, setForm] = useState({
    name: "",
    sellingPrice: "",
    stockQuantity: "",
  });

  const panelRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open && panelRef.current) {
      const firstInput = panelRef.current.querySelector(
        "input, button, select, textarea",
      );
      firstInput?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open || !panelRef.current) return;

    const focusableSelectors =
      "a[href], button:not([disabled]), textarea, input, select";

    const focusableElements =
      panelRef.current.querySelectorAll(focusableSelectors);

    if (focusableElements.length === 0) return;

    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);

    return () => {
      document.removeEventListener("keydown", handleTabKey);
    };
  }, [open]);

  /* 🔹 Handle slide-in animation */
  useEffect(() => {
    if (open) {
      setVisible(true);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showConfirm) {
          setShowConfirm(false); // close confirm first
        } else {
          handleClose(); // close panel
        }
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, showConfirm]);

  /* 🔹 Prefill form on edit */
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name ?? "",
        sellingPrice: product.sellingPrice ?? "",
        stockQuantity: product.stockQuantity ?? "",
      });
    } else {
      setForm({ name: "", sellingPrice: "", stockQuantity: "" });
    }
    setErrors({});
  }, [product, open]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (isEdit) {
      setShowConfirm(true);
    } else {
      submitForm();
    }
  };

  const submitForm = async () => {
    setLoading(true);
    setErrors({});

    try {
      const payload = {
        name: form.name,
        sellingPrice: Number(form.sellingPrice),
        stockQuantity: Number(form.stockQuantity),
      };

      if (isEdit) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }

      onSuccess();
      handleClose();
    } catch (err) {
      if (err.response?.status === 400) {
        setErrors(err.response.data.errors || {});
      } else {
        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-700"
      />

      {/* SIDE PANEL */}
      <div
        ref={panelRef}
        className={`
          fixed top-0 right-0 h-full w-[420px] bg-white z-50
          shadow-xl flex flex-col
          transform transition-transform duration-700 ease-in-out
          ${visible ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">
            {isEdit ? "Edit Product" : "Add Product"}
          </h3>
        </div>

        {/* FORM BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Selling Price *</label>
            <input
              type="number"
              name="sellingPrice"
              value={form.sellingPrice}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
            {errors.sellingPrice && (
              <p className="text-red-500 text-sm">{errors.sellingPrice}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Stock Quantity *
            </label>
            <input
              type="number"
              name="stockQuantity"
              value={form.stockQuantity}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
            {errors.stockQuantity && (
              <p className="text-red-500 text-sm">{errors.stockQuantity}</p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t bg-white flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-md font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
          </button>
        </div>
      </div>

      {/* CONFIRM UPDATE MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
          <div className="bg-white rounded p-6 w-80">
            <h3 className="text-lg font-semibold mb-3">Confirm Update</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to update this product?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={submitForm}
                className="bg-yellow-400 text-black px-4 py-2 rounded font-medium"
              >
                Yes, Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
