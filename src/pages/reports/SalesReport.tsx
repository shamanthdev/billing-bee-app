import { useEffect, useState } from "react";
import { getSalesReport } from "../../services/ReportService";
import DataTable from "../../common/DataTable";
import toast from "react-hot-toast";

interface ReportBill {
  id: number;
  billNumber: string;
  billDate: string;
  customerName: string;
  total: number;
  status: string;
}

export default function SalesReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [bills, setBills] = useState<ReportBill[]>([]);
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    if (!fromDate || !toDate) {
      toast.error("Select date range");
      return;
    }

    try {
      setLoading(true);

      const res = await getSalesReport({
        fromDate,
        toDate,
      });

      setBills(res.data);
    } catch {
      toast.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-semibold dark:text-white">
        Sales Report
      </h1>

      {/* Filters */}
      <div className="flex gap-4 items-end">

        <div>
          <label className="text-sm dark:text-gray-300">
            From Date
          </label>
          <input
            type="date"
            className="border rounded px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm dark:text-gray-300">
            To Date
          </label>
          <input
            type="date"
            className="border rounded px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
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

      </div>

      {/* Table */}

      <div className="border rounded-lg dark:border-slate-700 overflow-hidden">

        <DataTable
          columns={[
            { label: "Date", align: "left" },
            { label: "Bill No", align: "left" },
            { label: "Customer", align: "left" },
            { label: "Total", align: "right" },
            { label: "Status", align: "left" },
          ]}
          emptyText="No report data"
        >
          {bills.map((bill) => (
            <tr key={bill.id} className="border-b dark:border-slate-700">
              <td className="px-4 py-3 text-sm">
                {new Date(bill.billDate).toLocaleDateString()}
              </td>

              <td className="px-4 py-3 text-sm">
                {bill.billNumber}
              </td>

              <td className="px-4 py-3 text-sm">
                {bill.customerName || "-"}
              </td>

              <td className="px-4 py-3 text-sm text-right">
                ₹ {bill.total}
              </td>

              <td className="px-4 py-3 text-sm">
                {bill.status}
              </td>
            </tr>
          ))}
        </DataTable>

      </div>

    </div>
  );
}