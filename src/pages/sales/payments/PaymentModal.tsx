import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { createPayment } from "../../../services/PaymentService";
import { payBill } from "../../../services/BillService";

interface PaymentModalProps {
  bill: any; // refine later
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({
  bill,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [paymentMode, setPaymentMode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState(
    bill?.balanceAmount || 0
  );

  const handleConfirm = async () => {
    if (!paymentMode) {
      toast.error("Please select payment mode");
      return;
    }

    if (amount > bill.balanceAmount) {
      toast.error(`Max allowed: ₹${bill.balanceAmount}`);
      return;
    }
    try {
      setLoading(true);

      await payBill(bill.id, Number(bill.total));

      toast.success("Payment successful");

      onSuccess(); // refresh list
      onClose();   // close modal
    } catch (err: any) {
      toast.error(
        err?.message || "Payment failed"
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
        p-4
      "
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          w-full max-w-md
          rounded-2xl
          border border-gray-200 dark:border-white/10
          bg-white dark:bg-slate-900
          shadow-2xl
          p-6
          transition-all
          animate-in fade-in zoom-in-95
        "
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4
            p-1.5
            rounded-full
            text-gray-400
            hover:bg-gray-100
            dark:hover:bg-white/10
            hover:text-gray-700
            dark:hover:text-white
            transition
          "
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
          Make Payment
        </h2>

        {/* Payment Mode */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Payment Mode
          </label>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="
              w-full
              rounded-lg
              border border-gray-300 dark:border-white/10
              bg-white dark:bg-slate-800
              px-3 py-2.5
              text-sm
              text-gray-900 dark:text-gray-200
              focus:outline-none
              focus:ring-2 focus:ring-indigo-500
              transition
            "
          >
            <option value="">Select</option>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Card</option>
          </select>
        </div>

        {/* Amount */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Amount
          </label>
          <input
            type="number"
             className="
              w-full
              rounded-lg
              border border-gray-200 dark:border-white/10
              bg-gray-100 dark:bg-slate-800
              px-3 py-2.5
              text-sm
              text-gray-700 dark:text-gray-300
              cursor-not-allowed
            "
            value={amount}
            max={bill.balanceAmount}   // 🔥 IMPORTANT
            onChange={(e) => {
              const val = Number(e.target.value);

              if (val > bill.balanceAmount) {
                setAmount(bill.balanceAmount);
              } else {
                setAmount(val);
              }
            }}
          />
          {/* <input
            value={`₹ ${bill.total}`}
            disabled
            className="
              w-full
              rounded-lg
              border border-gray-200 dark:border-white/10
              bg-gray-100 dark:bg-slate-800
              px-3 py-2.5
              text-sm
              text-gray-700 dark:text-gray-300
              cursor-not-allowed
            "
          /> */}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="
              px-4 py-2
              rounded-lg
              border border-gray-300 dark:border-white/10
              text-sm
              text-gray-700 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-white/10
              transition
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="
              px-5 py-2
              rounded-lg
              bg-indigo-600
              text-white
              text-sm font-medium
              hover:bg-indigo-700
              shadow-md
              transition
              disabled:opacity-50
            "
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}