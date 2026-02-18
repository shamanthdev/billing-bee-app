import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayouts";
import Products from "./pages/Products";
import CreateBill from "./pages/sales/CreateBill";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";

import Bills from "./pages/sales/Bills";
import BillDetails from "./pages/sales/BillDetails";
import CustomerListPage from "./pages/customer/CustomerListPage";
import CustomerFormModal from "./pages/customer/CreateCustomer";
import Dashboard from "./pages/dashboard/Dashboard";
import { LoaderProvider } from "./common/Loader";
import AxiosLoaderSetup from "./common/AxiosLoaderSetup";

function App() {
  return (
    <LoaderProvider>
      <AxiosLoaderSetup />
      <BrowserRouter>
        <Toaster position="top-right" />

        <Routes>
          {/* Protected / main app */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sales" element={<Bills />} />
            <Route path="/sales/create" element={<CreateBill />} />
            <Route path="/sales/:id" element={<BillDetails />} />
            <Route path="/customers" element={<CustomerListPage />} />
          </Route>

          {/* Standalone pages */}
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </LoaderProvider>
  );
}

export default App;
