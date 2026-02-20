import { useEffect, useState } from "react";
import {
  getCustomers,
  deleteCustomer, // <-- make sure this exists in service
} from "../../services/CustomerService";
import { toast } from "react-hot-toast";
import DataTable from "../../common/DataTable";
import CustomerCreate from "./CreateCustomer";
import ConfirmModal from "../../common/ConfirmModal";
import LoadingOverlay from "../../common/LoadingOverlay";

export default function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCustomerToDeactivate, setSelectedCustomerToDeactivate] =
    useState(null);

  /* ---------------- LOAD CUSTOMERS ---------------- */
  const loadCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch {
      toast.error("Failed to load customers");
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  /* ---------------- CREATE / EDIT ---------------- */
  const handleAdd = () => {
    setSelectedCustomer(null);
    setOpen(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setOpen(true);
  };

  /* ---------------- DEACTIVATE ---------------- */
  const handleDeactivateClick = (customer) => {
    setSelectedCustomerToDeactivate(customer);
    setShowConfirm(true);
  };

  const handleDeactivate = async () => {
    if (!selectedCustomerToDeactivate) return;

    setLoading(true);
    try {
      await deleteCustomer(selectedCustomerToDeactivate.id);
      toast.success("Customer deleted successfully");
      setShowConfirm(false);
      setSelectedCustomerToDeactivate(null);
      loadCustomers(); // ✅ refresh list
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to deactivate customer"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6">
      <LoadingOverlay show={loading} />
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Customers</h2>
        <button
          onClick={handleAdd}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md font-medium"
        >
          + Create
        </button>
      </div>

      {/* Table */}
      <DataTable
             columns={[
               { label: "Customer Name", align: "left" },
               { label: "Email", align: "left" },
               { label: "Phone", align: "left" }, // ✅ ADDED
             
           
               { label: "Actions", align: "left" },
             ]}
             emptyText="No Customer found"
           >
        {customers.map((c) => (
          <tr
            key={c.id}
            className="border-b last:border-b-0 hover:bg-gray-50"
          >
            <td className="px-4 py-3 text-sm font-medium">{c.name}</td>
            <td className="px-4 py-3 text-sm">{c.phone || "-"}</td>
            <td className="px-4 py-3 text-sm">{c.email || "-"}</td>
            <td className="px-4 py-3 text-sm space-x-3">
              <button
                onClick={() => handleEdit(c)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeactivateClick(c)}
                className="text-red-600 hover:underline"
              >
                Deactivate
              </button>
            </td>
          </tr>
        ))}
      </DataTable>

      {/* Create / Edit Drawer */}
      {open && (
        <CustomerCreate
          open={open}
          onClose={() => setOpen(false)}
          customer={selectedCustomer}
          onSuccess={loadCustomers}
        />
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        open={showConfirm}
        title="Confirm"
        message={`Do you really want to deactivate ${selectedCustomerToDeactivate?.name}?`}
        subMessage="You can't undo this action."
        danger
        loading={loading}
        confirmText="Confirm"
        onCancel={() => !loading && setShowConfirm(false)}
        onConfirm={handleDeactivate}
      />
    </div>
  );
}
