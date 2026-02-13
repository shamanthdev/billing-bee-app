import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getActiveProducts, createBill } from "../services/ProductService";

export default function CreateBill() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [billItems, setBillItems] = useState([]);

  /* -------------------- Load Products -------------------- */
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getActiveProducts();
      setProducts(data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  /* -------------------- Add Item -------------------- */
  const handleAddItem = () => {
    const product = products.find((p) => p.id === Number(selectedProductId));
    if (!product) return;

    setBillItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);

      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                lineTotal: (item.quantity + quantity) * item.price,
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          price: product.sellingPrice,
          quantity,
          lineTotal: product.sellingPrice * quantity,
        },
      ];
    });

    setSelectedProductId("");
    setQuantity(1);
  };

  /* -------------------- Remove Item -------------------- */
  const handleRemoveItem = (index) => {
    setBillItems((prev) => prev.filter((_, i) => i !== index));
  };

  /* -------------------- Totals -------------------- */
  const subtotal = billItems.reduce((sum, item) => sum + item.lineTotal, 0);

  /* -------------------- Cancel -------------------- */
  const handleCancel = () => {
    if (billItems.length > 0) {
      const confirmLeave = window.confirm(
        "You have unsaved sale items. Are you sure you want to cancel?",
      );
      if (!confirmLeave) return;
    }
    navigate("/sales");
  };

  /* -------------------- Create Bill -------------------- */
  const handleCreateBill = async () => {
    const payload = {
      items: billItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      await createBill(payload);
      toast.success("Sale created successfully");
      navigate("/sales");
    } catch (error) {
      toast.error("Failed to create sale");
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-semibold">Create Sale</h1>
          <p className="text-sm text-gray-500">
            Add products and generate a sales invoice
          </p>
        </div>

        <button
          onClick={handleCancel}
          className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>

      {/* Add Item (FULL WIDTH — gap fixed) */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-4">Add Item</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded-md px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <button
            onClick={handleAddItem}
            disabled={!selectedProductId || quantity < 1}
            className="bg-yellow-400 hover:bg-yellow-500 text-black
    px-5 py-2 rounded-md text-sm font-medium
    whitespace-nowrap
    disabled:opacity-40 disabled:cursor-not-allowed"
          >
            + Add to Sale
          </button>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Product</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">Qty</th>
              <th className="text-left px-4 py-3">Total</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {billItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No items added yet.
                </td>
              </tr>
            ) : (
              billItems.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.productName}</td>
                  <td className="px-4 py-3">₹{item.price}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">₹{item.lineTotal}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary (below table, right aligned) */}
      <div className="flex justify-end mt-4">
        <div className="bg-white p-4 rounded shadow w-full max-w-md">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">₹{subtotal}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg mb-4">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>

          <button
            onClick={handleCreateBill}
            disabled={billItems.length === 0}
            className="w-full bg-black text-white py-2 rounded
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create Sale
          </button>
        </div>
      </div>
    </div>
  );
}
