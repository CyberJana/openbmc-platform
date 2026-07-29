import { Activity, Database, LayoutDashboard, LogOut, Server, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/systems", label: "Systems", icon: Server },
  { to: "/monitoring", label: "Monitoring", icon: Activity },
  { to: "/users", label: "Users", icon: Users },
];

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Database size={20} />
          <div>
            <h1>OpenBMC Platform</h1>
            <p>Firmware research console</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link")}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p className="user-label">{user?.full_name ?? user?.email}</p>
          <button className="button button-ghost" onClick={logout} type="button">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
