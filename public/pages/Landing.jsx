import { useNavigate } from "react-router-dom";
import logo from "../assets/Synex_Logo.jpeg";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      {/* Logo */}
      <div className="flex justify-center md:justify-start mb-10">
        <img
          src={logo}
          alt="Synex Logo"
          className="h-20 w-auto drop-shadow-2xl"
        />
      </div>

      {/* Layout changed: top then bottom */}
      <div className="flex flex-col gap-10">
        <div>
          <p className="inline-block px-3 py-1 rounded-full bg-sky-400/20 border border-sky-300/30 text-sky-100 text-xs font-semibold">
            Unified Bank Dashboard
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-bold leading-tight text-sky-50">
            Synex — One View of All Your Accounts
          </h1>

          <p className="mt-5 text-sky-200 leading-relaxed max-w-3xl text-lg">
            Connect multiple banks, view balances, track transactions, and see
            spending insights — all in one secure place.
          </p>

          <div className="mt-8 flex gap-4 flex-wrap">
            {/* start demo -> login */}
            <button
              onClick={() => navigate("/login")}
              className="px-7 py-4 rounded-2xl bg-sky-300 text-slate-900 font-semibold hover:bg-sky-200 transition shadow-lg"
            >
              Get Started
            </button>

            {/* demo dashboard protected */}
            <button
              onClick={() => navigate("/dashboard")}
              className="px-7 py-4 rounded-2xl border border-white/20 text-sky-50 font-semibold hover:bg-white/10 transition"
            >
              View Demo Dashboard
            </button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-7 shadow-sm max-w-3xl">
          <h3 className="font-semibold text-xl text-sky-50">
            What you’ll get
          </h3>

          <ul className="mt-5 space-y-3 text-sky-200 text-lg">
            <li>✅ Unified total balance</li>
            <li>✅ Bank-wise cards</li>
            <li>✅ Categorized transactions</li>
            <li>✅ Filters & insights</li>
            <li>✅ Consent-based connect flow</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
