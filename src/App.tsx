import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Products from "./pages/Products";
import CreateBill from "./pages/sales/CreateBill";
import Login from "./pages/Login";
import Bills from "./pages/sales/Bills";
import BillDetails from "./pages/sales/BillDetails";
import CustomerListPage from "./pages/customer/CustomerListPage";
import Dashboard from "./pages/dashboard/Dashboard";

import { LoaderProvider } from "./common/Loader";
import AxiosLoaderSetup from "./common/AxiosLoaderSetup";
import MainLayout from "./layouts/MainLayout";
import SalesReport from "./pages/reports/SalesReport";

function App() {
  return (
    <LoaderProvider>
      <AxiosLoaderSetup />

      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0f172a",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        />

        <Routes>
          {/* Login (Standalone) */}
          <Route path="/" element={<Dashboard />} />

          {/* Main App Layout */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sales" element={<Bills />} />
            <Route path="/sales/create" element={<CreateBill />} />
            <Route path="/sales/:id" element={<BillDetails />} />
            <Route path="/sales/edit-bill/:billId" element={<CreateBill />} />
            <Route path="/customers" element={<CustomerListPage />} />
            <Route path="/reports/sales" element={<SalesReport />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </LoaderProvider>
  );
}

export default App;