import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Vouchers from "./pages/Vouchers";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Cockpit from "./pages/Cockpit";
import Treasury from "./pages/Treasury";
import Inventory from "./pages/Inventory";
import Statements from "./pages/Statements";
import Payroll from "./pages/Payroll";
import Sales from "./pages/Sales";
import Procurement from "./pages/Procurement";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route index element={<Cockpit />} />
        <Route path="/vouchers" element={<Vouchers />} />
        <Route path="/statements" element={<Statements />} />
        <Route path="/treasury" element={<Treasury />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/procurement" element={<Procurement />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
