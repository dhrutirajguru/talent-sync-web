import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { usePrimaryRole } from "@/context/AuthContext";
import { NAV_BY_ROLE } from "@/config/nav";

export function AppLayout() {
  const role = usePrimaryRole();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const items = role ? NAV_BY_ROLE[role] ?? [] : [];
  const current = items.find((i) => location.pathname.startsWith(i.path));
  const title = current?.label ?? (location.pathname.startsWith("/notifications") ? "Notifications" : "TalentSync");

  return (
    <div className="app-shell">
      <Sidebar role={role ?? ""} open={sidebarOpen} />
      <div className="main-area">
        <Header title={title} onMenuToggle={() => setSidebarOpen((v) => !v)} />
        <section className="page">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
