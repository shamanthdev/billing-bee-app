import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getBillDetails, cancelBill } from "../../services/BillService";

import ConfirmModal from "../../common/ConfirmModal";
import PaymentSection from "./payments/PaymentSection";
import PaymentDetails from "./payments/PaymentDetails";

export default function BillDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadBill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ---------------- LOAD BILL ---------------- */
  const loadBill = async () => {
    try {
      setLoading(true);
      const data = await getBillDetails(id);
      setBill(data);
    } catch (error) {
      toast.error("Failed to load bill details");
      setBill(null);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CANCEL BILL ---------------- */
  const handleCancelBill = async () => {
    if (!bill) return;

    try {
      setCancelLoading(true);
      await cancelBill(bill.id);
      toast.success("Bill cancelled successfully");
      setShowCancelConfirm(false);
      loadBill();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to cancel bill");
    } finally {
      setCancelLoading(false);
    }
  };
  const handlePaymentSuccess = () => {
    // After payment, just refresh bill details
    loadBill();
  };

  if (loading) return <div className="p-6">Loading bill details...</div>;
  if (!bill) return <div className="p-6">Bill not found</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8 no-print">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 flex items-center">
          <span
            onClick={() => navigate("/sales")}
            className="cursor-pointer hover:underline"
          >
            Sales
          </span>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-800">{bill.billNumber}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {bill.status === "ACTIVE" && (
            <>
              <button
                onClick={() => navigate(`/sales/edit-bill/${bill.id}`)}
                className="px-4 py-2 rounded-md bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition"
              >
                Edit Bill
              </button>

              <button
                onClick={() => setShowCancelConfirm(true)}
                className="px-4 py-2 rounded-md border border-red-500 text-red-600 text-sm font-medium hover:bg-red-50 transition"
              >
                Cancel Bill
              </button>
            </>
          )}

          <button
            onClick={() => window.print()}
            disabled={bill.status === "CANCELLED"}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            Print / PDF
          </button>
        </div>
      </div>

      {/* Invoice Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">INVOICE</h1>
          <div className="text-sm text-gray-600 space-y-1">
            <div>
              Invoice No: <span className="font-medium">{bill.billNumber}</span>
            </div>
            <div>
              Date: {new Date(bill.billDate).toLocaleDateString("en-IN")}
            </div>
            <div>
              Customer:{" "}
              <span className="font-medium">{bill.customerName || "—"}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <span
          className={`px-3 py-1 rounded text-sm font-medium ${
            bill.status === "CANCELLED"
              ? "bg-red-100 text-red-700"
              : bill.status === "PAID"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {bill.status}
        </span>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg shadow mb-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3">Product</th>
              <th className="text-right px-4 py-3">Price</th>
              <th className="text-right px-4 py-3">Qty</th>
              <th className="text-right px-4 py-3">GST %</th>
              <th className="text-right px-4 py-3">GST</th>
              <th className="text-right px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-3">{item.productName}</td>
                <td className="px-4 py-3 text-right">
                  ₹{Number(item.price).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">{item.quantity}</td>
                <td className="px-4 py-3 text-right">{item.gstPercent}%</td>
                <td className="px-4 py-3 text-right">
                  ₹{Number(item.gstAmount).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  ₹{Number(item.lineTotal).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary + Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Summary */}
        <div className="bg-white border rounded-lg shadow-sm">
          <div className="p-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{bill.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Discount</span>
              <span>- ₹{bill.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST</span>
              <span>₹{bill.gstAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-dashed" />

          <div className="p-4 flex justify-between items-center bg-gray-50">
            <span className="text-base font-semibold">Total Payable</span>
            <span className="text-2xl font-bold">₹{bill.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Details */}
        <div
  className={`
    transition-all duration-300 ease-out
    ${
      bill.status === "PAID"
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-2"
    }
  `}
>
        <PaymentDetails billId={bill.id} billStatus={bill.status} />
</div>
      </div>

      {/* Pay Now */}
      <div
  className={`
    transition-all duration-300 ease-out
    ${
      bill.status === "ACTIVE"
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-4 pointer-events-none"
    }
  `}
>
      <PaymentSection bill={bill} onPaymentSuccess={handlePaymentSuccess} />
      </div>

      {/* Cancel Modal */}
      <ConfirmModal
        open={showCancelConfirm}
        title="Cancel Bill"
        message={`Do you really want to cancel bill ${bill.billNumber}?`}
        subMessage="This will restore stock and cannot be undone."
        danger
        loading={cancelLoading}
        confirmText="Yes, Cancel Bill"
        onConfirm={handleCancelBill}
        onCancel={() => !cancelLoading && setShowCancelConfirm(false)}
      />
    </div>
  );
}
