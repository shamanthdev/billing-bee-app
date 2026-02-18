import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getActiveProducts, createBill } from "../../services/ProductService";
import { getCustomers } from "../../services/CustomerService";
import DataTable from "../../common/DataTable";

export default function CreateSale() {
  const navigate = useNavigate();

  /* -------------------- State -------------------- */
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [customerId, setCustomerId] = useState("");

  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [billItems, setBillItems] = useState([]);
  const [discount, setDiscount] = useState(0);

  /* -------------------- Load Initial Data -------------------- */
  useEffect(() => {
    loadProducts();
    loadCustomers();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getActiveProducts();
      setProducts(data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch {
      toast.error("Failed to load customers");
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
    if (!selectedProduct || quantity < 1) return;

    setBillItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === selectedProduct.id
      );

      const price = selectedProduct.sellingPrice;
      const taxPercent = selectedProduct.taxPercent || 0;

      if (existing) {
        return prev.map((i) => {
          if (i.productId !== selectedProduct.id) return i;

          const newQty = i.quantity + quantity;
          const lineTotal = newQty * price;
          const taxAmount = (lineTotal * taxPercent) / 100;

          return {
            ...i,
            quantity: newQty,
            lineTotal,
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
    0
  );

  const totalGst = billItems.reduce(
    (sum, item) => sum + item.taxAmount,
    0
  );

  const total =
    subtotal - Number(discount || 0) + totalGst;

  /* -------------------- Cancel -------------------- */
  const handleCancel = () => {
    if (billItems.length > 0) {
      if (
        !window.confirm(
          "You have unsaved items. Are you sure you want to cancel?"
        )
      )
        return;
    }
    navigate("/sales");
  };

  /* -------------------- Create Bill -------------------- */
  const handleCreateSale = async () => {
    if (!customerId) {
      toast.error("Please select a customer");
      return;
    }

    if (billItems.length === 0) {
      toast.error("Add at least one item");
      return;
    }

    const payload = {
      customerId,
      discount: Number(discount || 0),
      items: billItems.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    };

    try {
      await createBill(payload);
      toast.success("Sale created successfully");
      navigate("/sales");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create sale"
      );
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

      {/* Customer */}
      <div className="bg-white p-4 rounded shadow mb-6 max-w-4xl">
        <label className="block text-sm font-medium mb-1">
          Customer <span className="text-red-500">*</span>
        </label>

        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm w-full"
        >
          <option value="">Select customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add Item */}
      <div className="bg-white p-4 rounded shadow mb-6 max-w-4xl">
        <h2 className="text-sm font-medium text-gray-700 mb-4">
          Add Item
        </h2>

        <div className="grid grid-cols-4 gap-4 items-end">
          <select
            value={selectedProductId}
            onChange={handleProductChange}
            className="border rounded-md px-3 py-2 text-sm"
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
            onChange={(e) =>
              setQuantity(Number(e.target.value))
            }
            className="border rounded-md px-3 py-2 text-sm"
          />

          <div className="border rounded-md px-3 py-2 text-sm bg-gray-50">
            <div className="text-xs text-gray-500">
              GST %
            </div>
            <div className="font-medium">
              {selectedProduct
                ? `${selectedProduct.taxPercent ?? 0}%`
                : "--"}
            </div>
          </div>

          <button
            onClick={handleAddItem}
            disabled={!selectedProduct}
            className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-md px-4 py-2 font-medium disabled:opacity-40"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Items Table */}
      <DataTable
        columns={[
          { label: "Product", align: "left" },
          { label: "Price", align: "right" },
          { label: "Qty", align: "center" },
          { label: "GST", align: "right" },
          { label: "Total", align: "right" },
          { label: "Action", align: "center" },
        ]}
        emptyText="No items added yet"
      >
        {billItems.map((item, index) => (
          <tr key={index} className="border-b">
            <td className="px-4 py-3">{item.productName}</td>
            <td className="px-4 py-3 text-right">
              ₹{item.price}
            </td>
            <td className="px-4 py-3 text-center">
              {item.quantity}
            </td>
            <td className="px-4 py-3 text-right">
              {item.taxPercent}% (₹{item.taxAmount})
            </td>
            <td className="px-4 py-3 text-right">
              ₹{item.lineTotal}
            </td>
            <td className="px-4 py-3 text-center">
              <button
                onClick={() => handleRemoveItem(index)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </DataTable>

      {/* Summary */}
      <div className="flex justify-end mt-6">
        <div className="bg-white p-4 rounded shadow w-full max-w-md">
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>GST</span>
            <span>₹{totalGst.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm mb-4">
            <span>Discount</span>
            <input
              type="number"
              min="0"
              value={discount}
              onChange={(e) =>
                setDiscount(e.target.value)
              }
              className="w-24 border rounded px-2 py-1 text-right"
            />
          </div>

          <div className="flex justify-between font-semibold text-lg mb-4">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCreateSale}
            className="w-full bg-black text-white py-2 rounded"
          >
            Create Sale
          </button>
        </div>
      </div>
    </div>
  );
}
