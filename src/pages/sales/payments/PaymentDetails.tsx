import { useEffect, useState } from "react";
import { getPaymentByBillId } from "../../../services/PaymentService";
import toast from "react-hot-toast";

interface Payment {
  paymentMode: string;
  status: string;
  amount: number;
  paymentDate: string;
  transactionRef?: string;
}

interface PaymentDetailsProps {
  billId: number;
  billStatus: "ACTIVE" | "PAID" | "CANCELLED";
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  billId,
  billStatus,
}) => {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch payment only if bill is PAID
  useEffect(() => {
    if (billStatus === "PAID") {
      fetchPaymentDetails();
    }
    // eslint-disable-next-line
  }, [billStatus]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      const res = await getPaymentByBillId(billId);
      setPayment(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load payment details");
    } finally {
      setLoading(false);
    }
  };

  // If bill not paid, don’t render anything
  if (billStatus !== "PAID") {
    return null;
  }

  if (loading) {
    return (
      <div className="
        mt-6
        rounded-lg
        border
        border-gray-200
        dark:border-white/10
        bg-white
        dark:bg-white/5
        p-4
        text-sm
        text-gray-600
        dark:text-gray-400
        transition-colors
      ">
        Loading payment details...
      </div>
    );
  }

  if (!payment) return null;

  return (
    <div className="
      mt-6
      rounded-lg
      border
      border-green-200
      dark:border-green-500/20
      bg-green-50
      dark:bg-green-500/10
      p-5
      shadow-sm
      transition-colors
    ">
      <h3 className="mb-4 text-sm font-semibold text-green-800 dark:text-green-400">
        Payment Details
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400">
            Payment Mode
          </p>
          <p className="font-medium text-gray-900 dark:text-gray-200">
            {payment.paymentMode}
          </p>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400">
            Status
          </p>
          <p className="font-medium text-green-700 dark:text-green-400">
            {payment.status}
          </p>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400">
            Amount Paid
          </p>
          <p className="font-medium text-gray-900 dark:text-gray-200">
            ₹ {payment.amount}
          </p>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400">
            Payment Date
          </p>
          <p className="font-medium text-gray-900 dark:text-gray-200">
            {new Date(payment.paymentDate).toLocaleString()}
          </p>
        </div>

        {payment.transactionRef && (
          <div className="col-span-2">
            <p className="text-gray-500 dark:text-gray-400">
              Transaction Reference
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-200">
              {payment.transactionRef}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;