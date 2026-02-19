import { useEffect, useState } from "react";
import { getPaymentByBillId } from "../../../services/PaymentService";
import toast from "react-hot-toast";

const PaymentDetails = ({ billId, billStatus }) => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch payment only if bill is PAID
  useEffect(() => {
    if (billStatus === "PAID") {
      fetchPaymentDetails();
    }
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
      <div className="mt-6 rounded-md border border-gray-200 p-4 text-sm text-gray-600">
        Loading payment details...
      </div>
    );
  }

  if (!payment) return null;

  return (
    <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
      <h3 className="mb-4 text-sm font-semibold text-green-800">
        Payment Details
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Payment Mode</p>
          <p className="font-medium">{payment.paymentMode}</p>
        </div>

        <div>
          <p className="text-gray-500">Status</p>
          <p className="font-medium text-green-700">
            {payment.status}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Amount Paid</p>
          <p className="font-medium">₹ {payment.amount}</p>
        </div>

        <div>
          <p className="text-gray-500">Payment Date</p>
          <p className="font-medium">
            {new Date(payment.paymentDate).toLocaleString()}
          </p>
        </div>

        {payment.transactionRef && (
          <div className="col-span-2">
            <p className="text-gray-500">Transaction Reference</p>
            <p className="font-medium">
              {payment.transactionRef}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;
