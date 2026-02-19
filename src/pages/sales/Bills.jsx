import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getBills } from "../../services/BillService";
import { dateViewFormating } from "../../helper/helper";

import DataTable from "../../common/DataTable";
import LoadingOverlay from "../../common/LoadingOverlay";

export default function Bills() {
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBills();
  }, [page, size, search]);

  /* ---------------- LOAD BILLS ---------------- */
  const loadBills = async () => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 0)); // allow loader paint

      const data = await getBills({
        page,
        size,
        search,
      });

      setBills(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      toast.error("Failed to load bills");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startRecord = page * size + 1;
  const endRecord = Math.min((page + 1) * size, totalElements);

  return (
    <div className="p-6 max-w-6xl relative">
      {/* Loader */}
      <LoadingOverlay show={loading} text="Loading bills..." />

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Bills</h1>

        <button
          onClick={() => navigate("/sales/create")}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md font-medium"
        >
          + Create Bill
        </button>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search bill number..."
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
          className="border px-3 py-2 rounded w-64 text-sm"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={[
          { label: "Bill No", align: "left" },
          { label: "Date", align: "left" },
          { label: "Customer", align: "left" }, // ✅ ADDED
          { label: "Discount", align: "right" },
          { label: "GST", align: "right" },
          { label: "Subtotal", align: "right" },
          { label: "Total", align: "right" },
          { label: "Status", align: "center" },
          { label: "Action", align: "center" },
        ]}
        emptyText="No bills found"
      >
        {bills.map((bill) => (
          <tr
            key={bill.id}
            className="border-b last:border-b-0 hover:bg-gray-50"
          >
            <td className="px-4 py-3 text-sm font-medium">{bill.billNumber}</td>

            <td className="px-4 py-3 text-sm text-gray-500">
              {dateViewFormating(bill.billDate)}
            </td>

            <td className="px-4 py-3 text-sm">{bill.customerName || "-"}</td>

            <td className="px-4 py-3 text-sm text-right">
              ₹{bill.discount ?? 0}
            </td>

            <td className="px-4 py-3 text-sm text-right">
              ₹{bill.gstAmount ?? 0}
            </td>

            <td className="px-4 py-3 text-sm font-medium text-right">
              ₹{bill.subtotal ?? 0}
            </td>

            <td className="px-4 py-3 text-sm font-medium text-right">
              ₹{bill.total ?? 0}
            </td>
            <td className="px-4 py-3 text-center">
              <span

                className={`px-2 py-1 text-xs rounded font-medium ${
                  bill.status === "CANCELLED"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {bill.status}
              </span>
            </td>

            <td className="px-4 py-3 text-sm text-center">
              <button
               disabled={bill.status === "CANCELLED"}
                onClick={() => navigate(`/sales/${bill.id}`)}
                className="text-blue-600 hover:underline font-medium"
              >
                View
              </button>
            </td>
          </tr>
        ))}
      </DataTable>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2 items-center">
          <select
            value={size}
            onChange={(e) => {
              setPage(0);
              setSize(Number(e.target.value));
            }}
            className="border px-2 py-2 rounded text-sm"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>

          <span className="text-sm text-gray-600">
            Showing {totalElements === 0 ? 0 : startRecord}–{endRecord} of{" "}
            {totalElements}
          </span>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setPage(0)}
            disabled={page === 0}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            «
          </button>

          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            ‹
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-3 py-1 border rounded ${
                i === page ? "bg-gray-200 font-medium" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages - 1 || totalPages === 0}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            ›
          </button>

          <button
            onClick={() => setPage(totalPages - 1)}
            disabled={page === totalPages - 1 || totalPages === 0}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
