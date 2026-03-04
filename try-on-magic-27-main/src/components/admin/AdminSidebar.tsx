import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Image,
  Building2,
  Settings,
  Zap,
  BarChart3,
  Shirt,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../ThemeProvider";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Try-Ons", icon: Shirt, path: "/try-ons" },
  { label: "Users", icon: Users, path: "/users" },
  { label: "Brands", icon: Building2, path: "/brands" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "API & Extensions", icon: Zap, path: "/api" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const AdminSidebar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
          <Shirt className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-foreground tracking-tight">TryOn AI</h1>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-primary/10 text-primary glow-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <button
          onClick={toggleTheme}
          className="mb-3 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <div className="rounded-lg bg-secondary p-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-muted-foreground">System Online</span>
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">GPU: 4x A100</p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
