import { useNavigate } from "react-router-dom";
import logo from "../assets/Synex_Logo.jpeg";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* logo top */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="Synex Logo"
          className="h-12 w-12 rounded-xl shadow"
        />
        <span className="text-sky-50 font-bold text-xl">Synex</span>
      </div>

      {/* stacked layout */}
      <div className="mt-12 space-y-10">
        {/* Top section */}
        <div>
          <div className="inline-flex px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sky-100 text-sm font-semibold">
            Unified Bank Dashboard
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-extrabold leading-tight text-sky-50">
            Synex — One View of All Your Accounts
          </h1>

          <p className="mt-5 text-lg text-sky-200 max-w-2xl">
            Connect multiple banks, view balances, track transactions, and see
            spending insights — all in one secure place.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/connect")}
              className="px-7 py-4 rounded-2xl bg-sky-300 text-slate-900 font-bold hover:bg-sky-200 transition"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-7 py-4 rounded-2xl bg-white/5 border border-white/10 text-sky-50 font-bold hover:bg-white/10 transition"
            >
              View Dashboard
            </button>
          </div>
        </div>

        {/* Bottom section */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl font-bold text-sky-50">What you’ll get</h2>

          <ul className="mt-6 space-y-4 text-sky-100">
            {[
              "Unified total balance",
              "Bank-wise cards",
              "Categorized transactions",
              "Filters & insights",
              "Consent-based connect flow",
              "Charts & analytics",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✅</span>
                <span className="text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
