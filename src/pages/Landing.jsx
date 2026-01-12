import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Left */}
        <div>
          <p className="inline-block px-3 py-1 rounded-full bg-sky-400/20 border border-sky-300/30 text-sky-100 text-xs font-semibold">
            Unified Bank Dashboard
          </p>

          <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-sky-50">
            Synex — One View of{" "}
            <span className="text-sky-200">All</span> Your Accounts
          </h1>

          <p className="mt-4 text-sky-200 leading-relaxed">
            Connect multiple banks, view balances, track transactions, and see spending insights —
            all in one secure place.
          </p>

          <div className="mt-8 flex gap-3 flex-wrap">
            <button
              onClick={() => navigate("/connect")}
              className="px-5 py-3 rounded-xl bg-sky-300 text-slate-900 font-semibold hover:bg-sky-200 transition"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-5 py-3 rounded-xl border border-white/20 text-sky-50 font-semibold hover:bg-white/10 transition"
            >
              View Demo Dashboard
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-sky-50">
            What you’ll get
          </h3>

          <ul className="mt-4 space-y-3 text-sky-200">
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
