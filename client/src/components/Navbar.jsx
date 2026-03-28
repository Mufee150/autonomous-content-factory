import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="site-nav">
      <div className="nav-shell">
        <p className="brand-title">Autonomous Content Factory</p>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Dashboard
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

