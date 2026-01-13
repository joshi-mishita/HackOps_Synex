import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth";
import ThemeToggle from "./ThemeToggle";

// ✅ add this import (make sure file name matches)
import logo from "../assets/Synex_Logo.jpeg";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const user = localStorage.getItem("synex_user") || "User";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSwitch = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full border-b border-white/10 bg-[var(--bg)]/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* ✅ LOGO + BRAND */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Synex Logo"
            className="h-10 w-10 rounded-xl shadow"
          />
          <span className="text-sky-50 font-bold text-xl tracking-wide">
            Synex
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            to="/"
            className="text-sky-200 hover:text-sky-50 transition text-sm font-semibold"
          >
            Home
          </Link>

          {loggedIn ? (
            <>
              <Link
                to="/connect"
                className="text-sky-200 hover:text-sky-50 transition text-sm font-semibold"
              >
                Connect
              </Link>

              <Link
                to="/dashboard"
                className="text-sky-200 hover:text-sky-50 transition text-sm font-semibold"
              >
                Dashboard
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                <div className="h-7 w-7 rounded-full bg-sky-300/20 border border-sky-300/30 flex items-center justify-center text-sky-50 text-sm font-bold">
                  {user.charAt(0).toUpperCase()}
                </div>
                <span className="text-sky-100 text-sm font-semibold">
                  {user}
                </span>
              </Link>

              <button
                onClick={handleSwitch}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm font-semibold text-sky-100"
              >
                Switch Account
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-500/15 text-red-200 border border-red-500/20 hover:bg-red-500/25 transition text-sm font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-sky-300 text-slate-900 font-semibold hover:bg-sky-200 transition text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
