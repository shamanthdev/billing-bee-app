import { useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { createPayment } from "../../../services/PaymentService";

export default function PaymentModal({ bill, onClose, onSuccess }) {
  const [paymentMode, setPaymentMode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!paymentMode) {
      toast.error("Please select payment mode");
      return;
    }

    try {
      setLoading(true);

      await createPayment({
        billId: bill.id,
        paymentMode,
        amount: bill.total,
      });

      toast.success("Payment successful");
      onSuccess();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Payment failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/50 backdrop-blur-sm
      "
    >
      {/* Modal */}
      <div
        className="
          w-full max-w-md
          rounded-xl bg-white
          shadow-2xl
          p-6
          animate-scale-in
        "
      >
        <h2 className="text-lg font-semibold mb-4">
          Make Payment
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Payment Mode
          </label>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select</option>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Card</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Amount
          </label>
          <input
            value={bill.total}
            disabled
            className="w-full rounded-md border bg-gray-100 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-md border text-sm hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-5 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>,
    document.body // 🔥 THIS IS THE FIX
  );
}
