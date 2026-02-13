import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getBills } from "../services/ProductService";

export default function Bills() {
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      setLoading(true);
      const data = await getBills();
      setBills(data);
    } catch (error) {
      toast.error("Failed to load bills");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Bills Table */}
      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Bill No</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Subtotal</th>
              <th className="text-left px-4 py-3">Total</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  Loading bills...
                </td>
              </tr>
            ) : bills.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  No bills created yet
                </td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr
                  key={bill.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">
                    {bill.billNumber}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(bill.billDate).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    ₹{bill.subtotal}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    ₹{bill.total}
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
    </div>
  );
}