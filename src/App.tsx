import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Products from "./pages/product/Products";
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
import Signup from "./pages/SignUp";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import SalesDashboard from "./pages/dashboard/Dashboard";
// import ForgotPassword from "./pages/auth/ForgotPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

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

          {/* Public (blocked if logged in) */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected */}
          <Route
           element={
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  }
          >
            

            {/* <Route path="/dashboard" element={<SalesDashboard />} /> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sales" element={<Bills />} />
            <Route path="/sales/create" element={<CreateBill />} />
            <Route path="/sales/:id" element={<BillDetails />} />
            <Route path="/sales/edit-bill/:billId" element={<CreateBill />} />
            <Route path="/customers" element={<CustomerListPage />} />
            <Route path="/reports" element={<SalesReport />} />
            

          </Route>

          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </BrowserRouter>
    </LoaderProvider>
  );
}

export default App;