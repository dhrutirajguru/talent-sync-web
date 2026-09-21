import { NavLink } from "react-router-dom";
import { NAV_BY_ROLE } from "@/config/nav";

interface SidebarProps {
  role: string;
  open: boolean;
}

export function Sidebar({ role, open }: SidebarProps) {
  const items = NAV_BY_ROLE[role] ?? [];

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <h2>⚡ TalentSync</h2>
      <small className="brand-sub">ACADEMIA • SKILLS • INDUSTRY</small>
      <nav>
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? "on" : "")}
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
        <NavLink to="/notifications" className={({ isActive }) => (isActive ? "on" : "")}>
          🔔 Notifications
        </NavLink>
      </nav>
      <footer>SIH 2026 Prototype</footer>
    </aside>
  );
}
