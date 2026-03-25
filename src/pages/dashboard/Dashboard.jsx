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
import {
  getSalesDashboard,
  getLowStockProducts,
  getDashboard
} from "../../services/DashboardService";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function SalesDashboard() {
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState({
    totalReceived: 0,
    totalPending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [lowStock, setLowStock] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    loadDashboard();
  }, []);
  const loadDashboard = async () => {
    try {
      const res = await getSalesDashboard();
      const lowStockRes = await getLowStockProducts();
      const summaryRes = await getDashboard();

      setData(res?.data || res);
      setLowStock(lowStockRes?.data || lowStockRes);
      setSummary(summaryRes?.data || summaryRes);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          ))}
        </div>

        <div className="h-72 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
      </div>
    );
  }
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

        <KpiCard
          title="Total Received"
          value={summary.totalReceived || 0}
          icon={<Wallet size={18} />}
          color="green"
          highlight={summary.totalReceived > 0}
        />

        <KpiCard
          title="Total Pending"
          value={summary.totalPending || 0}
          icon={<TrendingUp size={18} />}
          color="orange"
          highlight={summary.totalPending > 0}
        />

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

        <p className="text-sm text-gray-400 mb-4">
          Last 7 days sales performance 📈
        </p>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data.dailySales || []}>

            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FACC15" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#FACC15" stopOpacity={0} />
              </linearGradient>
            </defs>

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
              fill="url(#colorSales)"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

          </LineChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* RECENT BILLS */}
      <SectionCard title={
        <div className="flex justify-between items-center">
          <span>Recent Bills</span>

          <button
            onClick={() => navigate("/sales")}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All →
          </button>
        </div>
      }>

        {data.recentBills?.length === 0 ? (
          <p className="text-gray-400 text-center py-6">
            No recent bills yet 🚀
          </p>
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
                  className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition cursor-pointer"
                  onClick={() => navigate(`/sales/${bill.id}`)}
                >
                  <td className="py-3 font-medium">
                    {bill.billNumber}
                  </td>

                  <td>
                    {new Date(bill.billDate).toLocaleDateString()}
                  </td>

                  <td className="text-right font-semibold">
                    ₹ {Number(bill.totalAmount || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        )}

      </SectionCard>

      {/* LOW STOCK */}
      <SectionCard title="Low Stock Products">

        {lowStock.length === 0 ? (
          <p className="text-gray-400 text-center py-6">
            All products are well stocked ✅
          </p>
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

                  <td className="text-right">
                    <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs font-semibold">
                      {product.stockQuantity} left
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

        )}

      </SectionCard>

    </div>
  );
}

/* ==================== KPI CARD ==================== */
function KpiCard({ title, value, icon, isCurrency = true, color = "yellow", highlight = false }) {

  const colorMap = {
    yellow: "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400",
    green: "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    orange: "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  };

  return (
    <div className={`
  bg-white
  dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800
  border border-gray-200 dark:border-slate-800
  rounded-xl
  p-6
  shadow-sm
  hover:shadow-lg hover:-translate-y-1
  transition-all duration-300
  ${highlight ? "ring-1 ring-orange-500/40" : ""}
`}>

      <div className="flex justify-between items-start">

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {title}
          </p>

          <p className="text-2xl font-semibold mt-2 text-gray-900 dark:text-white">
            {isCurrency && "₹ "}
            <CountUp end={value || 0} duration={1.5} separator="," />
          </p>
        </div>

        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          {icon}
        </div>

      </div>

    </div>
  );
}

/* ==================== SECTION CARD ==================== */
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