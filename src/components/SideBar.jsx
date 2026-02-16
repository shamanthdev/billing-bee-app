import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItem = (label, path) => {
const isActive = location.pathname.startsWith(path);



    return (
      <div
        onClick={() => navigate(path)}
        className={`px-3 py-2 rounded cursor-pointer transition-colors duration-200
          ${
            isActive
              ? "bg-yellow-400 text-black font-medium"
              : "text-white hover:bg-gray-800"
          }`}
      >
        {label}
      </div>
    );
  };

  return (
    <div className="h-screen w-60 bg-black text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-4 text-xl font-bold text-yellow-400">
        Billing Bee
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4">
        <div className="mt-4 space-y-2 text-sm">
          {menuItem("Dashboard", "/dashboard")}
          {menuItem("Inventory", "/products")}
          {menuItem("Sales", "/sales")}
          {/* {menuItem("Inventory", "/inventory")} */}
          {menuItem("Customers", "/customers")}
          {menuItem("Reports", "/reports")}
          {menuItem("Payments", "/payments")}
          {menuItem("Logout", "/login")}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 text-xs text-gray-400">
        © Billing Bee
      </div>
    </div>
  );
}
