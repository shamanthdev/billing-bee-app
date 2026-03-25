import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { CloudCog, Trash2 } from "lucide-react";

import { getActiveProducts } from "../../services/ProductService";
import {
  createBill,
  updateBill,
  getBillDetails,
} from "../../services/BillService";
import { getCustomers } from "../../services/CustomerService";
import DataTable from "../../common/DataTable";
import SelectOption from "../../common/SelectOption";
import api from "../../api/axios";

export default function CreateSale() {
  const navigate = useNavigate();
  const { billId } = useParams();
  const isEdit = Boolean(billId);

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  // const [customerId, setCustomerId] = useState(null);
  const [phone, setPhone] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [billItems, setBillItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentType, setPaymentType] = useState("PAID");

  /* ---------------- Load ---------------- */
  console.log("CreateSale loaded", products);

  useEffect(() => {
    loadProducts();
    loadCustomers();
  }, []);

  useEffect(() => {
    if (isEdit) loadBillForEdit();
  }, [billId]);

  const loadProducts = async () => {
    try {
      const data = await getActiveProducts();
      setProducts(data?.data);
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

  const loadBillForEdit = async () => {
    try {
      const bill = await getBillDetails(billId);

      setCustomerId(bill.customerId);
      setDiscount(bill.discount || 0);
      // ✅ ADD THIS LOGIC
      const paymentType =
        Number(bill.total) > 0 ? "CREDIT" : "PAID";

      setPaymentType(paymentType);
      setBillItems(
        bill.items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          price: i.price,
          quantity: i.quantity,
          taxPercent: i.gstPercent,
          taxAmount: i.gstAmount,
          lineTotal: i.lineTotal,
        })),
      );
    } catch {
      toast.error("Failed to load bill");
      navigate("/sales");
    }
  };

  /* ---------------- Handlers ---------------- */

  const handleProductChange = (e) => {
    const id = Number(e.target.value);
    setSelectedProductId(id);
    setSelectedProduct(products.find((p) => p.id === id));
  };

  const handleAddItem = () => {
    if (!selectedProduct || quantity < 1) return;

    const price = selectedProduct.sellingPrice;
    const taxPercent = selectedProduct.taxPercent || 0;

    const lineTotal = price * quantity;
    const taxAmount = (lineTotal * taxPercent) / 100;

    setBillItems((prev) => [
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
    ]);

    setSelectedProductId("");
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleRemoveItem = (index) => {
    setBillItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = billItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const totalGst = billItems.reduce((sum, i) => sum + i.taxAmount, 0);
  const discountPercent = Number(discount || 0);
  const discountAmount = (subtotal * discountPercent) / 100;

  const total = subtotal - discountAmount + totalGst;
  // const total = subtotal - Number(discount || 0) + totalGst;

  const handleSubmitSale = async () => {
    if (!customerId && !phone) {
      return toast.error("Select customer or enter phone number");
    }
    if (!billItems.length) return toast.error("Add at least one item");

    const payload = {
      customerId: customerId || null,
      phoneNumber: phone || null, // NEW
      discount: discountAmount,
      paymentType, //NEW (RECEIVED / CREDIT)

      items: billItems.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    };

    try {
      if (isEdit) {
        await updateBill(billId, payload);
        toast.success("Sale updated successfully");
        navigate(`/sales/${billId}`);
      } else {
        await createBill(payload);
        toast.success("Sale created successfully");
        navigate("/sales");
      }
    } catch {
      toast.error("Failed to save sale");
    }
  };

  /* ---------------- UI ---------------- */


  const handlePhoneChange = async (value) => {
    setPhone(value);
    setCustomerId(null);

    if (value.length === 10) {
      try {
        const res = await api.get(`/customers/by-phone/${value}`);

        if (res.data) {
          setCustomerId(res.data.id);
          setPhone("");
        }
      } catch (err) {
        // not found → ignore
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span
          onClick={() => navigate("/sales")}
          className="cursor-pointer hover:underline"
        >
          Sales
        </span>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-800 dark:text-gray-200">
          {isEdit ? "Edit Sale" : "Create Sale"}
        </span>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isEdit ? "Edit Sale" : "Create Sale"}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Add products and generate a professional invoice
        </p>
      </div>

      {/* Customer Section */}
      {/* Customer Section */}
      <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
        <label className="block text-sm font-medium mb-2">
          Customer <span className="text-red-500">*</span>
        </label>

        <div className="flex gap-4 flex-col md:flex-row md:items-center">

          {/* Existing dropdown */}
          <div className="w-full md:w-1/2 lg:w-1/3">
            <SelectOption
              value={customerId}
              onChange={(val) => {
                setCustomerId(val);
                setPhone(""); // clear phone if customer selected
              }}
              placeholder="Select customer"
              options={customers.map((c) => ({
                label: c.name,
                value: c.id,
              }))}
            />
          </div>

          {/* 🔥 NEW phone input */}
          <div className="w-full md:w-1/2 lg:w-1/3">
            <input
              type="text"
              placeholder="Enter phone (walk-in)"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setCustomerId(null); // clear dropdown if phone entered
              }}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-[#1f1f1f] border-gray-300 dark:border-gray-700"
            />
          </div>

        </div>
      </div>

      {/* Add Item Section */}
      <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-5">
          Add Item
        </h2>

        <div className="grid md:grid-cols-4 gap-4 items-end">
          <SelectOption
            value={selectedProductId}
            onChange={(val) => {
              setSelectedProductId(val);
              setSelectedProduct(products.find((p) => p.id === val));
            }}
            placeholder="Select product"
            options={products.map((p) => ({
              label: p.name,
              value: p.id,
            }))}
          />

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="px-4 py-2.5 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f1f1f]"
          />

          <div className="px-4 py-2.5 rounded-md bg-gray-100 dark:bg-[#1f1f1f] text-sm text-gray-600 dark:text-gray-300">
            GST: {selectedProduct ? `${selectedProduct.taxPercent}%` : "--"}
          </div>

          <button
            onClick={handleAddItem}
            className="h-[42px] bg-primary hover:bg-primaryHover text-black font-medium rounded-md transition shadow-sm hover:shadow"
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
          { label: "Delete", align: "center" },
        ]}
        emptyText="No items added yet"
      >
        {billItems.map((item, index) => (
          <tr
            key={index}
            className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-[#202020] transition"
          >
            <td className="px-4 py-3">{item.productName}</td>
            <td className="px-4 py-3 text-right">₹{item.price}</td>
            <td className="px-4 py-3 text-center">{item.quantity}</td>
            <td className="px-4 py-3 text-right">₹{item.taxAmount}</td>
            <td className="px-4 py-3 text-right font-medium">
              ₹{item.lineTotal}
            </td>
            <td className="px-4 py-3 text-center">
              <button
                onClick={() => handleRemoveItem(index)}
                className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 transition"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </DataTable>

      {/* Summary */}
      {/* Bottom Section */}
      <div className="mt-10">
        {/* Summary Card - Full Width */}
        <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-lg p-8">
          <div className="max-w-md ml-auto space-y-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>GST</span>
              <span>₹{totalGst.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <span>Discount (%)</span>

              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="
      w-28 text-right px-3 py-1.5 rounded-md
      border border-gray-300 dark:border-gray-700
      bg-white dark:bg-[#1f1f1f]
      focus:ring-2 focus:ring-primary
      focus:outline-none
    "
                placeholder="%"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span></span>
                <span className="text-gray-400 text-xs">
                  (-₹{discountAmount.toFixed(2)})
                </span>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentType"
                  value="PAID"
                  checked={paymentType === "PAID"}
                  onChange={() => setPaymentType("PAID")}
                />
                Paid
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentType"
                  value="CREDIT"
                  checked={paymentType === "CREDIT"}
                  onChange={() => setPaymentType("CREDIT")}
                />
                Pending
              </label>
            </div>

            <div className="border-t border-dashed border-gray-300 dark:border-gray-700 pt-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Total
              </span>
              <span className="text-2xl font-bold tracking-tight">
                ₹{paymentType === "PAID" ? "0.00" : total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="
        px-5 py-2.5
        rounded-md
        border border-gray-300 dark:border-gray-700
        text-sm font-medium
        hover:bg-gray-100 dark:hover:bg-gray-800
        transition
      "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmitSale}
            className="
        px-8 py-2.5
        rounded-md
        bg-primary hover:bg-primaryHover
        text-black font-semibold text-sm
        shadow-sm hover:shadow-md
        transition
      "
          >
            {isEdit ? "Update Sale" : "Create Sale"}
          </button>
        </div>
      </div>
    </div>
  );
}
