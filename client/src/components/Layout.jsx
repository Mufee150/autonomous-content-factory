import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, Zap, BarChart3, Clock } from "lucide-react";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: Zap
    },
    {
      label: "History",
      path: "/history",
      icon: Clock
    },
    {
      label: "Analytics",
      path: "/analytics",
      icon: BarChart3
    }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-gradient-to-b from-slate-900 to-slate-800 backdrop-blur-lg transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="border-b border-slate-700/50 px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400">
              <Zap className="h-5 w-5 text-slate-900" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Autonomous</h1>
              <p className="text-xs text-slate-400">Content Factory</p>
            </div>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="space-y-2 px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700/50 bg-gradient-to-t from-slate-900/80 to-transparent px-4 py-4">
          <p className="text-xs text-slate-400">v1.0.0</p>
          <p className="text-xs text-slate-500">AI-Powered Content</p>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 border-b border-white/10 bg-white/80 backdrop-blur-lg">
          <div className="mx-auto flex items-center justify-between px-6 py-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <h2 className="text-2xl font-bold text-slate-900">
              Content Factory Dashboard
            </h2>

            {/* User Avatar placeholder */}
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
