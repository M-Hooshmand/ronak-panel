import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Sources from "./pages/Sources";
import Agents from "./pages/Agents";
import Pipelines from "./pages/Pipelines";
import Quality from "./pages/Quality";
import Vouchers from "./pages/Vouchers";
import Reports from "./pages/Reports";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Cockpit from "./pages/Cockpit";
import Treasury from "./pages/Treasury";
import Inventory from "./pages/Inventory";
import Statements from "./pages/Statements";
import Payroll from "./pages/Payroll";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route index element={<Cockpit />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/treasury" element={<Treasury />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/statements" element={<Statements />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/sources" element={<Sources />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/pipelines" element={<Pipelines />} />
        <Route path="/quality" element={<Quality />} />
        <Route path="/vouchers" element={<Vouchers />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
