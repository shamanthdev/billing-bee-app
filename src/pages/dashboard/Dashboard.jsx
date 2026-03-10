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
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getSalesDashboard();
      setData(res.data);
    } catch {
      toast.error("Failed to load dashboard");
    }
  };

  if (!data) return <div className="p-6">Loading dashboard...</div>;

  const paymentData = [
    { name: "Paid", value: data.paidAmount },
    { name: "Pending", value: data.pendingAmount },
  ];

  const axisColor = isDark ? "#CBD5F5" : "#6B7280";
  const gridColor = isDark ? "#1E293B" : "#E5E7EB";

  return (
    <div className="space-y-10">

      <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
        Dashboard Overview
      </h1>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard title="Today's Revenue" value={data.todayRevenue} icon={<TrendingUp size={18} />} />
        <KpiCard title="Monthly Revenue" value={data.monthlyRevenue} icon={<Wallet size={18} />} />
        <KpiCard title="Pending Amount" value={data.pendingAmount} icon={<AlertCircle size={18} />} />
        <KpiCard title="Total Bills" value={data.totalBills} icon={<Receipt size={18} />} isCurrency={false} />
      </div>

      {/* Line Chart */}
      <SectionCard title="Sales – Last 7 Days">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data.last7Days}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" stroke={axisColor} />
            <YAxis stroke={axisColor} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#0F172A" : "#fff",
                border: "none",
                borderRadius: "10px",
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#FACC15"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Bar Chart */}
      <SectionCard title="Paid vs Pending">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={paymentData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={axisColor} />
            <YAxis stroke={axisColor} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#0F172A" : "#fff",
                border: "none",
                borderRadius: "10px",
              }}
            />
            <Bar
              dataKey="value"
              fill="#FACC15"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

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
      dark:shadow-[0_0_0_1px_rgba(255,255,255,0.02)]
      transition
      hover:shadow-md
      dark:hover:shadow-yellow-500/10
    ">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
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
      dark:shadow-[0_0_0_1px_rgba(255,255,255,0.02)]
    ">
      <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
        {title}
      </h2>
      {children}
    </div>
  );
}