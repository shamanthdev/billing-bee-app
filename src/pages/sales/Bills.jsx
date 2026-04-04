import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Edit, Eye, Trash2 } from "lucide-react";

import { getBills, deleteBill } from "../../services/BillService";
import { dateViewFormating } from "../../helper/helper";
import DataTable from "../../common/DataTable";
import LoadingOverlay from "../../common/LoadingOverlay";
import ConfirmModal from "../../common/ConfirmModal";

export default function Bills() {
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  const startRecord = page * size + 1;
  const endRecord = Math.min((page + 1) * size, totalElements);

  const handleDelete = async () => {
    if (!billToDelete) return;
    
    try {
      setDeleteLoading(true);
      await deleteBill(billToDelete.id);
      toast.success("Bill deleted successfully");
      setShowDeleteConfirm(false);
      setBillToDelete(null);

      loadBills(); // refresh list
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete bill");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto relative">

      <LoadingOverlay show={loading} text="Loading bills..." />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Bills
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage all generated invoices
          </p>
        </div>

        <button
          onClick={() => navigate("/sales/create")}
          className="bg-primary hover:bg-primaryHover text-black px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition"
        >
          + Create Bill
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search bill number..."
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
          className="
            w-72 rounded-lg px-4 py-2.5 text-sm
            bg-white dark:bg-[#1f1f1f]
            border border-gray-300 dark:border-gray-700
            focus:outline-none focus:ring-2 focus:ring-primary
            transition
          "
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-hidden px-2">
        <DataTable
          columns={[
            { label: "Bill No", align: "left" },
            { label: "Date", align: "left" },
            { label: "Customer", align: "left" },
            { label: "Discount", align: "right" },
            { label: "GST", align: "right" },
            { label: "Subtotal", align: "right" },
            { label: "Total", align: "right" },
            { label: "Status", align: "center" },
            { label: "Payment Type", align: "center" },
            { label: "Action", align: "center" },
          ]}
          emptyText="No bills found"
        >
          {bills.map((bill) => (
            <tr
              key={bill.id}
              className="
              border-b border-gray-200 dark:border-gray-800
              hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition duration-200 last:border-none
            "
            >
              <td className="px-4 py-4 font-medium whitespace-nowrap">
                {bill.billNumber}
              </td>

              <td className="px-4 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {dateViewFormating(bill.billDate)}
              </td>

              <td className="px-4 py-4 whitespace-nowrap">
                {bill.customerName || "-"}
              </td>

              <td className="px-4 py-4 text-right">
                ₹{bill.discount ?? 0}
              </td>

              <td className="px-4 py-4 text-right">
                ₹{bill.gstAmount ?? 0}
              </td>

              <td className="px-4 py-4 font-medium text-right">
                ₹{bill.subtotal ?? 0}
              </td>

              <td className="px-4 py-4 font-semibold text-right">
                ₹{bill.total ?? 0}
              </td>


              <td className="px-4 py-3 text-center">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${bill.status === "CANCELLED"
                    ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                    : "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                    }`}
                >
                  {bill.status}
                </span>
              </td>

              <td className="px-4 py-3 text-center">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${bill.paymentType === "PENDING"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                    : "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                    }`}
                >
                  {bill.paymentType}
                </span>
              </td>

                <td className="px-5 py-3 flex justify-center gap-4">
                <button
                  disabled={bill.status === "CANCELLED"}
                  onClick={() => navigate(`/sales/${bill.id}`)}
                  className="
                  p-2 rounded-md
                  text-blue-600 dark:text-blue-400
                  hover:bg-blue-100 dark:hover:bg-blue-500/20
                  transition disabled:opacity-40
                "
                >
                  <Eye size={16} />
               
                </button>
                   {/* <button
                  disabled={bill.status === "CANCELLED"}
                  onClick={() => navigate(`/sales/${bill.id}`)}
                  className="
                  p-2 rounded-md
                  text-blue-600 dark:text-blue-400
                  hover:bg-blue-100 dark:hover:bg-blue-500/20
                  transition disabled:opacity-40
                "
                >
                  <Edit size={16} />
                </button> */}
                   <button
                  
                  onClick={() => {
                    setBillToDelete(bill);
                    setShowDeleteConfirm(true);
                  }}
                  className="
                  p-2 rounded-md
                  text-red-600 dark:text-red-400
                  hover:bg-red-100 dark:hover:bg-red-500/20
                  transition disabled:opacity-40
                "
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </DataTable>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">

          <div className="flex gap-3 items-center">
            <select
              value={size}
              onChange={(e) => {
                setPage(0);
                setSize(Number(e.target.value));
              }}
              className="
              rounded-lg px-3 py-2 text-sm
              bg-white dark:bg-[#1f1f1f]
              border border-gray-300 dark:border-gray-700
            "
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
            </select>

            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing {totalElements === 0 ? 0 : startRecord}–{endRecord} of{" "}
              {totalElements}
            </span>
          </div>

          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`
                px-3 py-1.5 rounded-md text-sm transition
                ${i === page
                    ? "bg-primary text-black font-medium"
                    : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                  }
              `}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
         {<ConfirmModal
              open={showDeleteConfirm}
              title="Delete Bill"
              message={`Are you sure you want to delete bill ${billToDelete?.billNumber}?`}
              subMessage={`This action cannot be undone.`}
              danger
              loading={deleteLoading}
              confirmText="Yes, Delete"
              onConfirm={handleDelete}
              onCancel={() => setShowDeleteConfirm(false)}
            />}
    </div>
  );
}