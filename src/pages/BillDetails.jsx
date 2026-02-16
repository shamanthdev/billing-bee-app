import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getBillDetails } from "../services/ProductService";

export default function BillDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadBill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadBill = async () => {
    try {
      setLoading(true);
      const data = await getBillDetails(id);
      setBill(data);
    } catch (error) {
      toast.error("Failed to load bill details");
      console.error(error);
      setBill(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading bill details...</div>;
  if (!bill) return <div className="p-6">Bill not found</div>;

  return (
    <div className="p-6 max-w-6xl">
      {/* Top Actions (hidden in print) */}
      <div className="flex justify-between items-center mb-4 no-print">
           <div className="flex items-center text-sm text-gray-500 mb-4">
        <span
          onClick={() => navigate("/sales")}
          className="cursor-pointer hover:underline text-gray-600"
        >
          Sales
        </span>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-800">
          {bill.billNumber}
        </span>
      </div>
        {/* <button
          onClick={() => navigate("/sales")}
          className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
        >
          Back
        </button> */}

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Print / PDF
        </button>
      </div>

      {/* Invoice Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">INVOICE</h1>
        <p className="text-sm text-gray-500">
          Invoice No: <strong>{bill.billNumber}</strong>
        </p>
        <p className="text-sm text-gray-500">
          Date:{" "}
          {new Date(bill.billDate).toLocaleDateString("en-IN")}
        </p>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded shadow mb-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-2">Product</th>
              <th className="text-right px-4 py-2">Price</th>
              <th className="text-right px-4 py-2">Qty</th>
              <th className="text-right px-4 py-2">GST %</th>
              <th className="text-right px-4 py-2">GST</th>
              <th className="text-right px-4 py-2">Amount</th>
            </tr>
          </thead>

          <tbody>
            {bill.items.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{item.productName}</td>
                <td className="px-4 py-2 text-right">
                  ₹{Number(item.price).toFixed(2)}
                </td>
                <td className="px-4 py-2 text-right">{item.quantity}</td>
                <td className="px-4 py-2 text-right">
                  {Number(item.gstPercent)}%
                </td>
                <td className="px-4 py-2 text-right">
                  ₹{Number(item.gstAmount).toFixed(2)}
                </td>
                <td className="px-4 py-2 text-right">
                  ₹{Number(item.lineTotal).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end">
        <div className="w-full max-w-md">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{Number(bill.subtotal).toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Discount</span>
            <span>₹{Number(bill.discount).toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>GST</span>
            <span>₹{Number(bill.gstAmount).toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
            <span>Total</span>
            <span>₹{Number(bill.total).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
