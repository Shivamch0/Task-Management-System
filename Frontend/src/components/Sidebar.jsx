import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  UserCircle,
  Settings as SettingsIcon,
  LogOut,
  X,
  Layers,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/ZenTask.png";

export function Sidebar({ isOpen, onClose }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Profile", path: "/dashboard/profile", icon: UserCircle },
    { name: "Settings", path: "/dashboard/settings", icon: SettingsIcon },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 dark:bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="h-16 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <NavLink
              to="/dashboard"
              className="flex items-center gap-2.5"
              onClick={onClose}
            >
              <img src={logoImg} alt="ZenTask Logo" className="h-8 w-auto object-contain rounded-lg" />
              <span className="font-display font-bold text-xl tracking-tight text-slate-800 dark:text-slate-100">
                ZenTask
              </span>
            </NavLink>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 lg:hidden rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`
                  }
                >
                  <Icon className="w-4.5 h-4.5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {currentUser && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-3 px-2">
              <img
                src={
                  currentUser.avatar ||
                  "https://api.dicebear.com/7.x/adventurer/svg"
                }
                alt={currentUser.name}
                className="w-10 h-10 rounded-full border border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-800 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate font-display">
                  {currentUser.name}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                  {currentUser.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4.5 h-4.5" />
              Sign Out
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
