import { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import { Moon, Sun } from "lucide-react";
import { Outlet } from "react-router-dom";
import UserMenu from "../components/UserMenu";

export default function MainLayout() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 min-h-screen bg-gray-50 dark:bg-[#0F172A] transition-colors duration-300">

        {/* Top Bar */}
        {/* Top Bar */}
        <div className="h-16 flex items-center justify-end gap-6 px-8 border-b border-gray-200 dark:border-gray-800">

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="relative w-14 h-8 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition"
          >
            <div
              className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
        ${darkMode ? "translate-x-6" : "translate-x-0"}
      `}
            />
            <div className="w-full flex justify-between px-1 text-yellow-500 dark:text-gray-300">
              <Sun size={14} />
              <Moon size={14} />
            </div>
          </button>

          {/* User Menu */}
          <UserMenu />

        </div>

        {/* Page Content */}
        <div className="p-8 text-gray-800 dark:text-gray-200 transition-colors duration-300">
          <Outlet />
        </div>

      </div>
    </div>
  );
}