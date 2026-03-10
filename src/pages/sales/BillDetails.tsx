import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getBillDetails, cancelBill } from "../../services/BillService";

import ConfirmModal from "../../common/ConfirmModal";
import PaymentSection from "./payments/PaymentSection";
import PaymentDetails from "./payments/PaymentDetails";

/* Minimal typing — we refine later */
interface BillItem {
  productName: string;
  price: number;
  quantity: number;
  gstPercent: number;
  gstAmount: number;
  lineTotal: number;
}

interface Bill {
  id: number;
  billNumber: string;
  billDate: string;
  customerName: string;
  status: "ACTIVE" | "PAID" | "CANCELLED";
  items: BillItem[];
  subtotal: number;
  discount: number;
  gstAmount: number;
  total: number;
}

export default function BillDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false);
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    loadBill();
    // eslint-disable-next-line
  }, [id]);

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

  const handleCancelBill = async () => {
    if (!bill) return;

    try {
      setCancelLoading(true);
      await cancelBill(bill.id);
      toast.success("Bill cancelled successfully");
      setShowCancelConfirm(false);
      loadBill();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to cancel bill");
    } finally {
      setCancelLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    loadBill();
  };

  if (loading)
    return (
      <div className="p-6 min-h-screen bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-300">
        Loading bill details...
      </div>
    );

  if (!bill)
    return (
      <div className="p-6 min-h-screen bg-white dark:bg-slate-900 text-red-500">
        Bill not found
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-200 transition-colors">

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8 no-print">
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <span
            onClick={() => navigate("/sales")}
            className="cursor-pointer hover:text-gray-900 dark:hover:text-white transition"
          >
            Sales
          </span>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {bill.billNumber}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {bill.status === "ACTIVE" && (
            <>
              <button
                onClick={() =>
                  navigate(`/sales/edit-bill/${bill.id}`)
                }
                className="px-4 py-2 rounded-md bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition"
              >
                Edit Bill
              </button>

              <button
                onClick={() => setShowCancelConfirm(true)}
                className="px-4 py-2 rounded-md border border-red-500 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition"
              >
                Cancel Bill
              </button>
            </>
          )}

          <button
            onClick={() => window.print()}
            disabled={bill.status === "CANCELLED"}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-40"
          >
            Print / PDF
          </button>
        </div>
      </div>

      {/* Invoice Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2">INVOICE</h1>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <div>
              Invoice No:{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {bill.billNumber}
              </span>
            </div>
            <div>
              Date:{" "}
              {new Date(bill.billDate).toLocaleDateString("en-IN")}
            </div>
            <div>
              Customer:{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {bill.customerName || "—"}
              </span>
            </div>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            bill.status === "CANCELLED"
              ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
              : bill.status === "PAID"
              ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
          }`}
        >
          {bill.status}
        </span>
      </div>

      {/* Items Table */}
      <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 shadow mb-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 uppercase text-xs">
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
              <tr
                key={idx}
                className="border-t border-gray-200 dark:border-white/10"
              >
                <td className="px-4 py-3">{item.productName}</td>
                <td className="px-4 py-3 text-right">
                  ₹{item.price.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">{item.quantity}</td>
                <td className="px-4 py-3 text-right">{item.gstPercent}%</td>
                <td className="px-4 py-3 text-right">
                  ₹{item.gstAmount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  ₹{item.lineTotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary + Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 shadow">
          <div className="p-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{bill.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>- ₹{bill.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST</span>
              <span>₹{bill.gstAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-white/10" />

          <div className="p-4 flex justify-between items-center bg-gray-50 dark:bg-white/5">
            <span className="text-base font-semibold">
              Total Payable
            </span>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              ₹{bill.total.toFixed(2)}
            </span>
          </div>
        </div>

        <PaymentDetails billId={bill.id} billStatus={bill.status} />
      </div>

      {bill.status === "ACTIVE" && (
        <PaymentSection
          bill={bill}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      <ConfirmModal
        open={showCancelConfirm}
        title="Cancel Bill"
        message={`Do you really want to cancel bill ${bill.billNumber}?`}
        subMessage="This will restore stock and cannot be undone."
        danger
        loading={cancelLoading}
        confirmText="Yes, Cancel Bill"
        onConfirm={handleCancelBill}
        onCancel={() =>
          !cancelLoading && setShowCancelConfirm(false)
        }
      />
    </div>
  );
}