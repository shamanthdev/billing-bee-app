import { useEffect, useState } from "react";
import { createCustomer, updateCustomer } from "../../services/CustomerService";
import { toast } from "react-hot-toast";
import FormField from "../../common/FormField";

export default function CustomerCreate({ open, onClose, customer, onSuccess }) {
  const isEdit = Boolean(customer);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (customer) setForm(customer);
  }, [customer]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      if (isEdit) {
        await updateCustomer(customer.id, form);
        toast.success("Customer updated");
      } else {
        await createCustomer(form);
        toast.success("Customer created");
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div className="w-[420px] bg-white h-full flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">
            {isEdit ? "Edit Customer" : "Add Customer"}
          </h3>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
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
            value={form.phone}
            onChange={handleChange}
          />

          <FormField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-between gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md font-medium"
          >
            {isEdit ? "Update Customer" : "Add Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small reusable field ---------- */
