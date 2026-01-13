import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function Profile() {
  const navigate = useNavigate();
  const name = localStorage.getItem("synex_user") || "User";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSwitch = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold text-sky-50">Profile</h1>
      <p className="mt-2 text-sky-200">Account details</p>

      <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 rounded-full bg-sky-300/20 border border-sky-300/30 flex items-center justify-center text-sky-50 font-bold text-xl">
            {name.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="text-xl font-semibold text-sky-50">{name}</p>
            <p className="text-sky-200 text-sm">Active session ✅</p>
          </div>
        </div>

        <div className="mt-10 flex gap-4 flex-wrap">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 rounded-xl bg-sky-300 text-slate-900 font-semibold hover:bg-sky-200 transition"
          >
            Go to Dashboard
          </button>

          <button
            onClick={handleSwitch}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sky-100 font-semibold hover:bg-white/10 transition"
          >
            Switch Account
          </button>

          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-100 font-semibold hover:bg-red-500/20 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
