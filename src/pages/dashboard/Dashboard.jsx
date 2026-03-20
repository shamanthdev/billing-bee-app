import { useEffect, useState } from "react";
import CountUp from "react-countup";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Wallet, Receipt } from "lucide-react";
import { getSalesDashboard, getLowStockProducts } from "../../services/DashboardService";
import toast from "react-hot-toast";

export default function SalesDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    loadDashboard();
  }, []);


  const loadDashboard = async () => {
    try {
      const res = await getSalesDashboard();
      const lowStockRes = await getLowStockProducts();
      setData(res?.data || res);
      setLowStock(lowStockRes?.data || lowStockRes);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading dashboard...</div>;
  if (!data) return <div className="p-8 text-red-500">Dashboard failed</div>;

  const axisColor = isDark ? "#CBD5F5" : "#6B7280";
  const gridColor = isDark ? "#1E293B" : "#E5E7EB";

  return (
    <div className="space-y-10">

      {/* Title */}
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
        Dashboard Overview
      </h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <KpiCard
          title="Total Sales"
          value={data.totalSales || 0}
          icon={<Wallet size={18} />}
        />

        <KpiCard
          title="Today's Sales"
          value={data.todaySales || 0}
          icon={<TrendingUp size={18} />}
        />

        <KpiCard
          title="Total Bills"
          value={data.totalBills || 0}
          icon={<Receipt size={18} />}
          isCurrency={false}
        />

      </div>

      {/* SALES CHART */}
      <SectionCard title="Sales Trend">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data.dailySales || []}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

            <XAxis dataKey="date" stroke={axisColor} />

            <YAxis stroke={axisColor} />

            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#0F172A" : "#fff",
                borderRadius: "10px",
                border: "none",
              }}
            />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="#FACC15"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* RECENT BILLS */}
      <SectionCard title="Recent Bills">

        {data.recentBills?.length === 0 ? (
          <p className="text-gray-400">No recent bills</p>
        ) : (

          <table className="w-full text-sm">
            <thead className="text-left border-b border-gray-200 dark:border-slate-800">
              <tr>
                <th className="py-3">Bill No</th>
                <th>Date</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>

            <tbody>

              {data.recentBills.map((bill, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-slate-800"
                >
                  <td className="py-3 font-medium">
                    {bill.billNumber}
                  </td>

                  <td>
                    {new Date(bill.billDate).toLocaleDateString()}
                  </td>

                  <td className="text-right font-semibold">
                    ₹{bill.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))}

            </tbody>
          </table>

        )}

      </SectionCard>

      <SectionCard title="Low Stock Products">

        {lowStock.length === 0 ? (
          <p className="text-gray-400">All products are well stocked</p>
        ) : (

          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 dark:border-slate-800">
              <tr>
                <th className="py-3 text-left">Product</th>
                <th className="text-right">Stock</th>
              </tr>
            </thead>

            <tbody>

              {lowStock.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 dark:border-slate-800"
                >

                  <td className="py-3 font-medium">
                    {product.name}
                  </td>

                  <td className="text-right text-red-500 font-semibold">
                    {product.stockQuantity}
                  </td>

                </tr>
              ))}

            </tbody>
          </table>

        )}

      </SectionCard>
      {/* <SalesDashboard /> */}
    </div>
  );
}

function KpiCard({ title, value, icon, isCurrency = true }) {
  return (
    <div className="
      bg-white
      dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800
      border border-gray-200 dark:border-slate-800
      rounded-xl
      p-6
      shadow-sm
      transition
      hover:shadow-md
    ">

      <div className="flex justify-between items-start">

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {title}
          </p>

          <p className="text-2xl font-semibold mt-2 text-gray-900 dark:text-white">
            {isCurrency && "₹"}
            <CountUp end={value} duration={1.5} separator="," />
          </p>
        </div>

        <div className="
          bg-yellow-100
          dark:bg-yellow-500/10
          text-yellow-600
          dark:text-yellow-400
          p-2
          rounded-lg
        ">
          {icon}
        </div>

      </div>

    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="
      bg-white
      dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950
      border border-gray-200 dark:border-slate-800
      rounded-xl
      p-6
      shadow-sm
    ">

      <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
        {title}
      </h2>

      {children}

    </div>
  );
}