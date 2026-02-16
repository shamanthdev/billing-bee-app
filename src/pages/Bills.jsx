import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getBills } from "../services/ProductService";
import { dateViewFormating } from "../helper/helper";

export default function Bills() {
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBills();
  }, [page, size, search]);

  const loadBills = async () => {
    try {
      setLoading(true);
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
    <div className="p-6 max-w-6xl">
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
      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Bill No</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Discount</th>
              <th className="px-4 py-3 text-left">GST</th>
              <th className="px-4 py-3 text-left">Subtotal</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  Loading bills...
                </td>
              </tr>
            ) : bills.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No bills found
                </td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr key={bill.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    {bill.billNumber}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {dateViewFormating(bill.billDate)}
                  </td>
                  <td className="px-4 py-3">₹{bill.discount ?? 0}</td>
                  <td className="px-4 py-3">₹{bill.gstAmount ?? 0}</td>
                  <td className="px-4 py-3 font-medium">
                    ₹{bill.subtotal ?? 0}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ₹{bill.total ?? 0}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => navigate(`/sales/${bill.id}`)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
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
        <span className=" flex items-center text-sm text-gray-600">
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
