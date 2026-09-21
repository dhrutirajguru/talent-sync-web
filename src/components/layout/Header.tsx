import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  title: string;
  onMenuToggle: () => void;
}

export function Header({ title, onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user ? `${user.first_name[0]}${user.last_name?.[0] ?? ""}`.toUpperCase() : "?";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button id="menu-toggle" onClick={onMenuToggle} aria-label="Toggle menu">
          ☰
        </button>
        <b>{title}</b>
      </div>
      <span style={{ position: "relative" }}>
        <button onClick={() => navigate("/notifications")} title="Notifications">
          🔔
        </button>
        <button onClick={() => setMenuOpen((v) => !v)} title={user?.email}>
          {initials}
        </button>
        {menuOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 48,
              background: "#fff",
              border: "1px solid var(--bd)",
              borderRadius: 8,
              boxShadow: "0 8px 25px #1938601a",
              minWidth: 160,
              overflow: "hidden",
            }}
          >
            <button
              className="secondary"
              style={{ width: "100%", borderRadius: 0, textAlign: "left" }}
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        )}
      </span>
    </header>
  );
}
