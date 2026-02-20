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
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Wallet,
  Receipt,
  AlertCircle,
} from "lucide-react";
import { getSalesDashboard } from "../../services/DashboardService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SalesDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getSalesDashboard();
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load dashboard");
    }
  };

  if (!data) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  const revenueGrowth =
    data.previousMonthRevenue > 0
      ? (
          ((data.monthlyRevenue - data.previousMonthRevenue) /
            data.previousMonthRevenue) *
          100
        ).toFixed(1)
      : 0;

  const paymentData = [
    { name: "Paid", value: data.paidAmount },
    { name: "Pending", value: data.pendingAmount },
  ];

  return (
    <div className="p-6 space-y-8 animate-fadeIn">

      {/* ---------------- KPI CARDS ---------------- */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <GlassCard
          title="Today's Revenue"
          value={data.todayRevenue}
          icon={<TrendingUp size={22} />}
          gradient="from-indigo-500 to-purple-600"
        />

        <GlassCard
          title="Monthly Revenue"
          value={data.monthlyRevenue}
          icon={<Wallet size={22} />}
          gradient="from-emerald-500 to-teal-600"
          extra={
            <span
              className={`text-xs font-medium ${
                revenueGrowth >= 0
                  ? "text-green-200"
                  : "text-red-200"
              }`}
            >
              {revenueGrowth >= 0 ? "+" : ""}
              {revenueGrowth}% vs last month
            </span>
          }
        />

        <GlassCard
          title="Pending Amount"
          value={data.pendingAmount}
          icon={<AlertCircle size={22} />}
          gradient="from-amber-500 to-orange-600"
        />

        <GlassCard
          title="Total Bills"
          value={data.totalBills}
          icon={<Receipt size={22} />}
          gradient="from-pink-500 to-rose-600"
          isCurrency={false}
        />
      </div>

      {/* ---------------- LINE CHART ---------------- */}

      <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/40">
        <h2 className="text-lg font-semibold mb-4">
          Sales – Last 7 Days
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.last7Days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ---------------- BAR CHART ---------------- */}

      <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/40">
        <h2 className="text-lg font-semibold mb-4">
          Paid vs Pending
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={paymentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ---------------- RECENT BILLS ---------------- */}

      <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/40">
        <h2 className="text-lg font-semibold mb-4">
          Recent Bills
        </h2>

        <table className="w-full text-sm">
          <thead className="text-left bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-2">Bill No</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2 text-right">Total</th>
              <th className="px-4 py-2 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.recentBills.map((bill) => (
              <tr
                key={bill.id}
                onClick={() =>
                  navigate(`/sales/${bill.id}`)
                }
                className="border-t hover:bg-white/70 cursor-pointer transition"
              >
                <td className="px-4 py-3">
                  {bill.billNumber}
                </td>
                <td className="px-4 py-3">
                  {bill.customerName}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  ₹{bill.total.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={bill.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Glass KPI Card ---------------- */

function GlassCard({
  title,
  value,
  icon,
  gradient,
  isCurrency = true,
  extra,
}) {
  return (
    <div
      className={`relative bg-gradient-to-r ${gradient} p-5 rounded-2xl shadow-xl text-white overflow-hidden`}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      <div className="relative z-10 flex justify-between items-start">
        <div>
          <div className="text-sm opacity-80">{title}</div>
          <div className="text-3xl font-bold mt-2">
            {isCurrency && "₹"}
            <CountUp
              end={value}
              duration={1.5}
              separator=","
              decimals={isCurrency ? 2 : 0}
            />
          </div>
          {extra && <div className="mt-1">{extra}</div>}
        </div>

        <div className="bg-white/20 p-2 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Status Badge ---------------- */

function StatusBadge({ status }) {
  const base =
    "px-3 py-1 rounded-full text-xs font-medium";

  if (status === "PAID") {
    return (
      <span className={`${base} bg-green-100 text-green-700`}>
        PAID
      </span>
    );
  }

  if (status === "CANCELLED") {
    return (
      <span className={`${base} bg-red-100 text-red-700`}>
        CANCELLED
      </span>
    );
  }

  return (
    <span className={`${base} bg-yellow-100 text-yellow-700`}>
      ACTIVE
    </span>
  );
}