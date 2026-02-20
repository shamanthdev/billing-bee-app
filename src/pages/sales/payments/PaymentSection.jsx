import { useState } from "react";
import PaymentModal from "./PaymentModal";

const PaymentSection = ({ bill, onPaymentSuccess }) => {
  const [showModal, setShowModal] = useState(false);

  // Show payment only if bill is ACTIVE
  if (!bill || bill.status !== "ACTIVE") {
    return null;
  }

  return (
     <div className="mt-6 flex justify-end">
      <button
        onClick={() => setShowModal(true)}
        className="
          rounded-md
          bg-indigo-600
          px-6 py-3
          text-sm font-medium
          text-white
          shadow-sm
          hover:bg-indigo-700
          hover:shadow-md
          transition
        "
      >
        Pay Now
      </button>

      {showModal && (
        <PaymentModal
          bill={bill}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            onPaymentSuccess && onPaymentSuccess();
          }}
        />
      )}
    </div>
  );
};

export default PaymentSection;
