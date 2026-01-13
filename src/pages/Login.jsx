import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  isLoggedIn,
  login,
  hasAccounts,
  getAccounts,
  createAccount,
  findAccount,
} from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();

  // ✅ if no accounts exist -> signup first
  const [mode, setMode] = useState(hasAccounts() ? "login" : "signup");

  const [selectedUser, setSelectedUser] = useState("");
  const [name, setName] = useState(""); // only for signup
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ accounts list (no demo users)
  const accounts = useMemo(() => getAccounts(), []);

  // default user selection (if accounts exist)
  useEffect(() => {
    if (accounts.length > 0) {
      setSelectedUser(accounts[0].name);
    }
  }, [accounts]);

  // ✅ auto-login if session active
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/connect", { replace: true });
    }
  }, [navigate]);

  const toggleMode = () => {
    setError("");
    setPassword("");

    // if switching to login but no accounts exist, stay in signup
    if (!hasAccounts() && mode === "signup") return;

    setMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  // ✅ Signup
  const handleSignup = () => {
    setError("");

    if (!name.trim()) return setError("Please enter your name.");
    if (!password.trim()) return setError("Please create a password.");
    if (password.length < 4)
      return setError("Password must be at least 4 characters.");

    setLoading(true);

    setTimeout(() => {
      const res = createAccount(name.trim(), password);

      if (!res.ok) {
        setLoading(false);
        setError(res.msg);
        return;
      }

      login();
      localStorage.setItem("synex_user", name.trim());

      setLoading(false);
      navigate("/connect", { replace: true });
    }, 700);
  };

  // ✅ Login
  const handleLogin = () => {
    setError("");

    if (!selectedUser) return setError("Please select a user.");
    if (!password.trim()) return setError("Please enter password.");

    const account = findAccount(selectedUser);
    if (!account) return setError("User not found.");
    if (password !== account.password) return setError("Incorrect password.");

    setLoading(true);

    setTimeout(() => {
      login();
      localStorage.setItem("synex_user", account.name);

      setLoading(false);
      navigate("/connect", { replace: true });
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-sky-50">
          {mode === "signup" ? "Sign Up" : "Login"}
        </h1>

        <p className="mt-2 text-sky-200">
          {mode === "signup"
            ? "Create an account to start using Synex."
            : "Sign in to continue to Synex."}
        </p>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-100 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* LOGIN MODE: user select */}
        {mode === "login" && (
          <div className="mt-8">
            <label className="text-sm text-sky-200 font-semibold">
              Select User
            </label>

            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-[#071626] border border-white/10 text-sky-50 outline-none focus:border-sky-300/40"
            >
              {accounts.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* SIGNUP MODE: name */}
        {mode === "signup" && (
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
        )}

        {/* Password */}
        <div className="mt-6">
          <label className="text-sm text-sky-200 font-semibold">
            Password
          </label>

          <div className="mt-2 relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "Create password" : "Enter password"}
              className="w-full px-4 py-3 pr-14 rounded-xl bg-[#071626] border border-white/10 text-sky-50 outline-none focus:border-sky-300/40"
            />

            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-sky-200 hover:text-sky-50 transition"
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={mode === "signup" ? handleSignup : handleLogin}
          disabled={loading}
          className="mt-8 w-full px-6 py-3 rounded-xl bg-sky-300 text-slate-900 font-semibold hover:bg-sky-200 transition disabled:opacity-60"
        >
          {loading
            ? mode === "signup"
              ? "Creating..."
              : "Signing in..."
            : mode === "signup"
            ? "Sign Up"
            : "Login"}
        </button>

        {/* Switch option */}
        <div className="mt-6 text-center text-sm text-sky-200">
          {mode === "signup" ? (
            hasAccounts() ? (
              <p>
                Already have an account?{" "}
                <button
                  onClick={toggleMode}
                  className="font-semibold text-sky-50 hover:underline"
                >
                  Login
                </button>
              </p>
            ) : (
              <p className="text-sky-200/70">
                No accounts exist yet. Please sign up first.
              </p>
            )
          ) : (
            <p>
              Want to add another user?{" "}
              <button
                onClick={toggleMode}
                className="font-semibold text-sky-50 hover:underline"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
