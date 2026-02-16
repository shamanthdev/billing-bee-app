import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getActiveProducts, createBill } from "../services/ProductService";

export default function CreateSale() {
  const navigate = useNavigate();

  /* -------------------- State -------------------- */
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [billItems, setBillItems] = useState([]);
  const [discount, setDiscount] = useState(0);

  console.log("selected products",selectedProduct)
  console.log("billitems",billItems)
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

  /* -------------------- Product Select -------------------- */
  const handleProductChange = (e) => {
    const productId = Number(e.target.value);
    setSelectedProductId(productId);

    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product || null);
  };

  /* -------------------- Add Item -------------------- */
const handleAddItem = () => {
  if (!selectedProduct) return;

  setBillItems((prev) => {
    const existingItem = prev.find(
      (item) => item.productId === selectedProduct.id
    );

    const taxPercent = selectedProduct.taxPercent || 0;
    const price = selectedProduct.sellingPrice;

    if (existingItem) {
      return prev.map((item) => {
        if (item.productId !== selectedProduct.id) {
          return item;
        }

        const newQuantity = item.quantity + quantity;
        const lineTotal = newQuantity * price;
        const taxAmount = (lineTotal * taxPercent) / 100;

        return {
          ...item,
          quantity: newQuantity,
          lineTotal,
          taxPercent,
          taxAmount,
        };
      });
    }

    const lineTotal = price * quantity;
    const taxAmount = (lineTotal * taxPercent) / 100;

    return [
      ...prev,
      {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        price,
        quantity,
        taxPercent,
        taxAmount,
        lineTotal,
      },
    ];
  });

  // reset
  setSelectedProductId("");
  setSelectedProduct(null);
  setQuantity(1);
};


  /* -------------------- Remove Item -------------------- */
  const handleRemoveItem = (index) => {
    setBillItems((prev) => prev.filter((_, i) => i !== index));
  };

  /* -------------------- Calculations -------------------- */
  const subtotal = billItems.reduce(
    (sum, item) => sum + item.lineTotal,
    0,
  );

  const totalGst = billItems.reduce(
    (sum, item) => sum + item.taxAmount,
    0,
  );

  const total =
    subtotal - Number(discount || 0) + totalGst;

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

  /* -------------------- Create Sale -------------------- */
  const handleCreateSale = async () => {
    const payload = {
      items: billItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      discount: Number(discount || 0),
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

  /* -------------------- UI -------------------- */
  return (
    <div className="p-6 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-semibold">Create Sale</h1>
          <p className="text-sm text-gray-500 mt-1">
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

      {/* Add Item */}
      <div className="bg-white p-4 rounded shadow mb-6 max-w-4xl">
        <h2 className="text-sm font-medium text-gray-700 mb-4">
          Add Item
        </h2>

        <div className="grid grid-cols-4 gap-4 items-end">
          {/* Product */}
          <select
            value={selectedProductId}
            onChange={handleProductChange}
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

          {/* Quantity */}
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded-md px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* GST (Read-only) */}
          <div className="border rounded-md px-3 py-2 text-sm bg-gray-50">
            <div className="text-xs text-gray-500">GST %</div>
            <div className="font-medium">
              {selectedProduct
                ? `${selectedProduct.taxPercent ?? 0}%`
                : "--"}
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddItem}
            disabled={!selectedProduct || quantity < 1}
            className="bg-yellow-400 hover:bg-yellow-500 text-black
              rounded-md px-4 py-2 font-medium
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            + Add to Sale
          </button>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded shadow mb-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-2">Product</th>
              <th className="text-left px-4 py-2">Price</th>
              <th className="text-left px-4 py-2">Qty</th>
              <th className="text-left px-4 py-2">GST</th>
              <th className="text-left px-4 py-2">Total</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {billItems.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500"
                >
                  No items added yet.
                </td>
              </tr>
            ) : (
              billItems.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">
                    {item.productName}
                  </td>
                  <td className="px-4 py-2">₹{item.price}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">
                    {item.taxPercent}% (₹
                    {item.taxAmount})
                  </td>
                  <td className="px-4 py-2">
                    ₹{item.lineTotal}
                  </td>
                  <td className="px-4 py-2 text-center">
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

      {/* Summary */}
      <div className="flex justify-end">
        <div className="bg-white p-4 rounded shadow w-full max-w-md">
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>GST</span>
            <span>₹{totalGst.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Discount</span>
            <input
              type="number"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-24 border rounded px-2 py-1 text-right"
            />
          </div>

          <div className="flex justify-between font-semibold text-lg mb-4">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCreateSale}
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
