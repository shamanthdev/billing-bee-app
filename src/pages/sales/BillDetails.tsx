import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getBillDetails, cancelBill } from "../../services/BillService";
import PaymentSection from "./payments/PaymentSection";
import PaymentDetails from "./payments/PaymentDetails";
import ConfirmModal from "../../common/ConfirmModal";
import { useAuth } from "../../context/AuthContext";
import DataTable from "../../common/DataTable";

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
  paymentType: "PENDING" | "PAID" | "CANCELLED";
}

export default function BillDetails() {
  const { id } = useParams<{ id: string }>();
  const { userDetails } = useAuth();
  const navigate = useNavigate();

  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadBill();
  }, [id]);

  const loadBill = async () => {
    try {
      setLoading(true);
      const data = await getBillDetails(id);
      setBill(data);
    } catch {
      toast.error("Failed to load bill details");
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

  if (loading) return <div className="p-6">Loading...</div>;
  if (!bill) return <div className="p-6 text-red-500">Bill not found</div>;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">

      {/* 🔴 TOP BAR */}
      <div className="flex justify-between mb-6 no-print">
        <button onClick={() => navigate("/sales")}>← Back</button>

        <div className="flex gap-3">
          {bill.paymentType !== "PAID" && (
            <>
              <button
                onClick={() => navigate(`/sales/edit-bill/${bill.id}`)}
                className="px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>

              <button
                onClick={() => setShowCancelConfirm(true)}
                className="px-4 py-2 border border-red-500 text-red-600 rounded"
              >
                Cancel
              </button>
            </>
          )}

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Print / PDF
          </button>
        </div>
      </div>

      {/* 🔥 INVOICE CARD */}
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 print-area">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              {userDetails?.businessName || "Billing Bee"}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {userDetails?.address || ""}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Phone: {userDetails?.phone || "-"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              GSTIN: {userDetails?.gstNumber || "-"}
            </p>
          </div>

          <div className="text-right">
            <h2 className="text-xl font-semibold">INVOICE</h2>
            <p>Bill No: {bill.billNumber}</p>
            <p>Date: {new Date(bill.billDate).toLocaleDateString()}</p>
            <p>Customer: {bill.customerName}</p>

            <span className="inline-block mt-2 px-3 py-1 text-sm rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              {bill.paymentType}
            </span>
          </div>
        </div>

        {/* TABLE */}
        <DataTable
          noScroll
          columns={[
            { label: "Product", align: "left" },
            { label: "Price", align: "right" },
            { label: "Qty", align: "center" },
            { label: "GST %", align: "center" },
            { label: "GST", align: "right" },
            { label: "Amount", align: "right" },
          ]}
          emptyText="No items found"
        >
          {bill.items.map((item, i) => (
            <tr
              key={i}
              className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition"
            >
              <td className="px-5 py-3">{item.productName}</td>
              <td className="px-5 py-3 text-right">₹{item.price}</td>
              <td className="px-5 py-3 text-center">{item.quantity}</td>
              <td className="px-5 py-3 text-center">{item.gstPercent}%</td>
              <td className="px-5 py-3 text-right">₹{item.gstAmount}</td>
              <td className="px-5 py-3 text-right font-medium">₹{item.lineTotal}</td>
            </tr>
          ))}
        </DataTable>

        {/* TOTALS */}
        <div className="mt-6 flex justify-end">
          <div className="w-64 text-sm space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{bill.subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span>- ₹{bill.discount}</span>
            </div>

            <div className="flex justify-between">
              <span>GST</span>
              <span>₹{bill.gstAmount}</span>
            </div>

            <div className="flex justify-between font-bold text-lg mt-2 border-t pt-2">
              <span>Total</span>
              <span>₹{bill.total}</span>
            </div>

            {bill.paymentType === "PENDING" && (
              <div className="flex justify-between text-red-600 font-semibold">
                <span>Balance</span>
                <span>₹{bill.total}</span>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-10">
          Thank you for your business 🙏
        </p>
      </div>

      {/* PAYMENT SECTION */}
      <div className="mt-6 no-print">
        <PaymentDetails billId={bill.id} billStatus={bill.status} />

        {bill.paymentType !== "PAID" && (
          <PaymentSection bill={bill} onPaymentSuccess={loadBill} />
        )}
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={showCancelConfirm}
        title="Cancel Bill"
        message={`Cancel bill ${bill.billNumber}?`}
        subMessage="This action cannot be undone."
        danger
        loading={cancelLoading}
        confirmText="Yes, Cancel"
        onConfirm={handleCancelBill}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </div>
  );
}