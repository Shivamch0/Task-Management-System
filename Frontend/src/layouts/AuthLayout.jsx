//? Imports
import { Layers } from "lucide-react";
import { Link, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/ZenTask.png";

export function AuthLayout() {
  const { currentUser, isAuthenticating } = useAuth();

  if (isAuthenticating) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <svg
          className="h-10 w-10 animate-spin text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 px-4 py-8 text-slate-805 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <img src={logoImg} alt="ZenTask Logo" className="h-9 w-auto object-contain rounded-lg" />
          <span className="font-display text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            ZenTask
          </span>
        </Link>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-premium dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
