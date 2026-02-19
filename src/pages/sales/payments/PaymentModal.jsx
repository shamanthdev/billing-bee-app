import { useState } from "react";
import { createPayment } from "../../../services/PaymentService";
import toast from "react-hot-toast";

const PaymentModal = ({ bill, onClose, onSuccess }) => {
  const [paymentMode, setPaymentMode] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!paymentMode) {
      toast.error("Please select payment mode");
      return;
    }

    const payload = {
      billId: bill.id,
      paymentMode,
      amount: bill.total,
      transactionRef:
        paymentMode === "UPI" || paymentMode === "CARD"
          ? transactionRef
          : null,
    };

    try {
      setLoading(true);
      await createPayment(payload);
      toast.success("Payment successful");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Payment failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Make Payment
        </h2>

        {/* Payment Mode */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Payment Mode
          </label>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Select</option>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Card</option>
          </select>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Amount
          </label>
          <input
            type="text"
            value={bill.total}
            disabled
            className="w-full cursor-not-allowed rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm"
          />
        </div>

        {/* Transaction Ref */}
        {(paymentMode === "UPI" || paymentMode === "CARD") && (
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Transaction Reference
            </label>
            <input
              type="text"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder="Enter transaction reference"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
