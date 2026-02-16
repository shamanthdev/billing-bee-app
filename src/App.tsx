import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayouts";
import Products from "./pages/Products";
import CreateBill from "./pages/CreateBill";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Bills from "./pages/Bills";
import BillDetails from "./pages/BillDetails";

function App() {
  return (
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

        </Route>

        {/* Standalone pages */}
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
