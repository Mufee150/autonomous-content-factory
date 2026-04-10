import { NavLink } from "react-router-dom";
import { Zap, LayoutDashboard, Home, Clock, BarChart3 } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="site-nav">
      <div className="nav-shell">
        {/* Brand */}
        <NavLink to="/" className="nav-brand">
          <div className="nav-logo">
            <Zap size={18} strokeWidth={2.5} />
          </div>
          <span className="nav-brand-name">Content Factory</span>
        </NavLink>

        {/* Links */}
        <div className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <Home size={15} />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <LayoutDashboard size={15} />
            <span>Pipeline</span>
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <Clock size={15} />
            <span>History</span>
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <BarChart3 size={15} />
            <span>Analytics</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
