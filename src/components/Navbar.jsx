// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full border-b border-white/10 bg-[#0B1C2D]/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left */}
        <Link to="/" className="text-xl font-bold text-sky-50 tracking-wide">
          Synex
        </Link>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-sky-200 hover:text-sky-50 transition text-sm font-semibold"
          >
            Home
          </Link>

          {loggedIn && (
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

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-500/15 text-red-200 border border-red-500/20 hover:bg-red-500/25 transition text-sm font-semibold"
              >
                Logout
              </button>
            </>
          )}

          {!loggedIn && (
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
