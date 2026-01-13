// src/pages/Login.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, login } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("Mishita");
  const [loading, setLoading] = useState(false);

  //  auto-login
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/connect", { replace: true });
    }
  }, [navigate]);

  const handleLogin = () => {
    setLoading(true);

    // fake auth delay
    setTimeout(() => {
      login();
      localStorage.setItem("synex_user", name || "User");
      navigate("/connect", { replace: true });
    }, 900);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-sky-50">Login</h1>
        <p className="mt-2 text-sky-200">
          Mock login for demo (no backend needed).
        </p>

        <div className="mt-8">
          <label className="text-sm text-sky-200 font-semibold">
            Your Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="mt-2 w-full px-4 py-3 rounded-xl bg-[#071626] border border-white/10 text-sky-50 outline-none focus:border-sky-300/40"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-8 w-full px-6 py-3 rounded-xl bg-sky-300 text-slate-900 font-semibold hover:bg-sky-200 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-5 text-xs text-sky-200/70 text-center">
          You will stay logged in until you logout.
        </p>
      </div>
    </div>
  );
}
