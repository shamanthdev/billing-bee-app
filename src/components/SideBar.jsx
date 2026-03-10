import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  CreditCard,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Inventory", path: "/products", icon: Package },
    { name: "Sales", path: "/sales", icon: ShoppingCart },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    { name: "Payments", path: "/payments", icon: CreditCard },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-[#111827] border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          Billing <span className="text-yellow-500">Bee</span>
        </h1>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button className="flex items-center gap-3 text-sm text-red-600 dark:text-red-400 hover:opacity-80 transition">
          <LogOut size={18} onClick={() => navigate("/")} />
          Logout
        </button>
      </div>
    </div>
  );
}
