import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getBillDetails } from "../services/ProductService";

export default function BillDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("bill////",bill)
  useEffect(() => {
    loadBill();
  }, [id]);

  const loadBill = async () => {
    try {
      setLoading(true);
      const response = await getBillDetails(id);
      console.log(response,"billdetailsss")
      setBill(response);
    } catch (error) {
      toast.error("Failed to load bill details");
      console.error(error);
      setBill(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loading state FIRST
  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading bill details...
      </div>
    );
  }

  // ✅ Only show "not found" AFTER loading finished
  if (!bill) {
    return (
      <div className="p-6 text-gray-500">
        Bill not found
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Bill Details</h1>
          <p className="text-sm text-gray-600 mt-1">
            Bill No:{" "}
            <span className="font-medium">{bill.billNumber}</span>
          </p>
          <p className="text-sm text-gray-600">
            Date:{" "}
            {new Date(bill.billDate).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={() => navigate("/sales")}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Back
        </button>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded shadow mb-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Product</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">Qty</th>
              <th className="text-left px-4 py-3">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-3">{item.productName}</td>
                <td className="px-4 py-3">₹{item.price}</td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3 font-medium">
                  ₹{item.lineTotal}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end">
        <div className="bg-white p-4 rounded shadow w-full max-w-md">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="font-medium">₹{bill.subtotal}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{bill.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
