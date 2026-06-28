import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";

export default function MainLayout() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}