import { useEffect, useState, ChangeEvent } from "react";
import { createCustomer, updateCustomer } from "../../services/CustomerService";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";
import FormField from "../../common/FormField";
import { Customer } from "../../types/customer.type";

interface CustomerCreateProps {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;   // 🔥 EXACT match
  onSuccess: () => void;
}

export default function CustomerCreate({
  open,
  onClose,
  customer,
  onSuccess,
}: CustomerCreateProps) {
  const isEdit = Boolean(customer);

  const [form, setForm] = useState<Customer>({
    id: 0,
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (customer) {
      setForm(customer);
    }
  }, [customer]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      if (isEdit && customer) {
        await updateCustomer(customer.id, form);
        toast.success("Customer updated");
      } else {
        await createCustomer(form);
        toast.success("Customer created");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Something went wrong"
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="flex-1 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="w-[420px] bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-l border-gray-200 dark:border-white/10">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEdit ? "Edit Customer" : "Add Customer"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <FormField
            label="Name"
            required
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <FormField
            label="Phone"
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
          />

          <FormField
            label="Email"
            name="email"
            value={form.email || ""}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Address
            </label>
            <textarea
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="px-6 py-5 border-t border-gray-200 dark:border-white/10 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-yellow-400 hover:bg-yellow-500 px-5 py-2 rounded-lg font-medium"
          >
            {isEdit ? "Update Customer" : "Add Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}