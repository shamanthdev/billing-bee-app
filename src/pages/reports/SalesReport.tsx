import { useEffect, useMemo, useState } from "react";
import { getSalesReport } from "../../services/ReportService";
import DataTable from "../../common/DataTable";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface ReportBill {
  id: number;
  billNumber: string;
  billDate: string;
  customerName: string;
  total: number;
  paymentType: string;
}

export default function SalesReport() {
  const navigate = useNavigate();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [bills, setBills] = useState<ReportBill[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");

  const loadReport = async () => {
    if (!fromDate || !toDate) {
      toast.error("Select date range");
      return;
    }

    try {
      setLoading(true);
      const res = await getSalesReport({ fromDate, toDate });
      setBills(res.data || []);
    } catch {
      toast.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SUMMARY CALCULATIONS
  const summary = useMemo(() => {
    const totalSales = bills.reduce((sum, b) => sum + Number(b.total || 0), 0);

    const paid = bills
      .filter((b) => b.paymentType === "PAID")
      .reduce((sum, b) => sum + Number(b.total || 0), 0);

    const pending = bills
      .filter((b) => b.paymentType === "PENDING")
      .reduce((sum, b) => sum + Number(b.total || 0), 0);

    return {
      totalSales,
      paid,
      pending,
      totalBills: bills.length,
    };
  }, [bills]);

  // 🔥 FILTER LOGIC
  const filteredBills =
    filter === "ALL"
      ? bills
      : bills.filter((b) => b.paymentType === filter);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-semibold dark:text-white">
        Sales Report
      </h1>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 items-end">

        <div>
          <label className="text-sm dark:text-gray-300">From Date</label>
          <input
            type="date"
            className="border rounded px-3 py-2 dark:bg-slate-900 dark:border-slate-700 ml-2"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm dark:text-gray-300">To Date</label>
          <input
            type="date"
            className="border rounded px-3 py-2 dark:bg-slate-900 dark:border-slate-700 ml-2"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button
          onClick={loadReport}
          className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded font-medium"
        >
          Generate
        </button>

        {/* PAYMENT FILTER */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="ml-auto border rounded px-3 py-2 dark:bg-slate-900 dark:border-slate-700 text-sm"
        >
          <option value="ALL">All</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      {/* 🔥 SUMMARY CARDS */}
      {bills.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-800">
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-xl font-semibold">
              ₹ {summary.totalSales.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-800">
            <p className="text-sm text-gray-500">Paid</p>
            <p className="text-xl font-semibold text-green-600 dark:text-green-400">
              ₹ {summary.paid.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-800">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">
              ₹ {summary.pending.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-800">
            <p className="text-sm text-gray-500">Total Bills</p>
            <p className="text-xl font-semibold">
              {summary.totalBills}
            </p>
          </div>

        </div>
      )}

      {/* TABLE */}
      <DataTable
        columns={[
          { label: "Date", align: "left" },
          { label: "Bill No", align: "left" },
          { label: "Customer", align: "left" },
          { label: "Total", align: "right" },
          { label: "Status", align: "center" },
        ]}
        emptyText="No report data"
      >
        {filteredBills.map((bill) => (
          <tr
            key={bill.id}
            onClick={() => navigate(`/sales/${bill.id}`)}
            className="border-b border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] cursor-pointer transition"
          >
            <td className="px-4 py-3">
              {new Date(bill.billDate).toLocaleDateString()}
            </td>

            <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">
              {bill.billNumber}
            </td>

            <td className="px-4 py-3">
              {bill.customerName || "-"}
            </td>

            <td className="px-4 py-3 text-right font-semibold">
              ₹ {Number(bill.total || 0).toLocaleString()}
            </td>

            <td className="px-4 py-3 text-center">
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  bill.paymentType === "PENDING"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                    : "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                }`}
              >
                {bill.paymentType}
              </span>
            </td>
          </tr>
        ))}
      </DataTable>

      {loading && (
        <p className="text-center text-gray-400">Loading...</p>
      )}
    </div>
  );
}