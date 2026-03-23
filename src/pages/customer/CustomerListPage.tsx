import { useEffect, useState } from "react";
import {
  getCustomers,
  deleteCustomer,
} from "../../services/CustomerService";
import { toast } from "react-hot-toast";
import DataTable from "../../common/DataTable";
import CustomerCreate from "./CreateCustomer";
import ConfirmModal from "../../common/ConfirmModal";
import LoadingOverlay from "../../common/LoadingOverlay";

/* ---------------- Types ---------------- */

interface Customer {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

/* ---------------- Component ---------------- */

export default function CustomerListPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCustomerToDeactivate, setSelectedCustomerToDeactivate] =
    useState<Customer | null>(null);

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

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpen(true);
  };

  /* ---------------- DEACTIVATE ---------------- */
  const handleDeactivateClick = (customer: Customer) => {
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
      loadCustomers();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to deactivate customer"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className=" dark:bg-slate-900 min-h-screen transition-colors">
      <LoadingOverlay show={loading} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Customers
        </h2>

        <button
          onClick={handleAdd}
          className="
            bg-yellow-400 hover:bg-yellow-500
            text-black
            px-4 py-2
            rounded-lg
            text-sm font-medium
            shadow-sm
            transition
          "
        >
          + Create
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <DataTable
          columns={[
            { label: "Customer Name", align: "left" },
            { label: "Email", align: "left" },
            { label: "Phone", align: "left" },
            { label: "Actions", align: "left" },
          ]}
          emptyText="No Customer found"
        >
          {customers.map((c) => (
            <tr
              key={c.id}
              className="
                border-b border-gray-200 dark:border-white/10
                last:border-b-0
                hover:bg-gray-50 dark:hover:bg-white/5
                transition
              "
            >
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-200">
                {c.name}
              </td>

              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {c.email || "-"}
              </td>

              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {c.phone || "-"}
              </td>

              <td className="px-4 py-3 text-sm space-x-4">
                <button
                  onClick={() => handleEdit(c)}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeactivateClick(c)}
                  className="text-red-600 dark:text-red-400 hover:underline"
                >
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>

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