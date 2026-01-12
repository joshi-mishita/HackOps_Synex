import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ConnectBanks() {
  const navigate = useNavigate();

  const allBanks = ["HDFC Bank", "ICICI Bank"];
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const toggleBank = (bank) => {
    setSelectedBanks((prev) =>
      prev.includes(bank) ? prev.filter((b) => b !== bank) : [...prev, bank]
    );
  };

  const grantConsent = () => {
    setStatus("loading");

    setTimeout(() => {
      const ok = Math.random() > 0.2;
      setStatus(ok ? "success" : "error");

      if (ok) setTimeout(() => navigate("/dashboard"), 800);
    }, 1600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-sky-50">Connect Banks</h1>

      <p className="mt-2 text-sky-200">
        Select banks and grant consent to securely fetch account information.
      </p>

      {/* Bank selection */}
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {allBanks.map((bank) => {
          const active = selectedBanks.includes(bank);

          return (
            <button
              key={bank}
              onClick={() => toggleBank(bank)}
              className={`p-5 rounded-2xl border text-left transition duration-200 ${
                active
                  ? "bg-sky-400/20 text-sky-50 border-sky-300/30"
                  : "bg-white/5 text-sky-100 border-white/10 hover:border-white/25"
              }`}
            >
              <p className="text-lg font-semibold">{bank}</p>
              <p className={`text-sm ${active ? "text-sky-200" : "text-sky-300"}`}>
                {active ? "Selected ✅" : "Tap to select"}
              </p>
            </button>
          );
        })}
      </div>

      {/* Consent Button */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          disabled={selectedBanks.length === 0 || status === "loading"}
          onClick={grantConsent}
          className="px-5 py-3 rounded-xl bg-sky-300 text-slate-900 font-semibold hover:bg-sky-200 transition disabled:opacity-40"
        >
          Grant Consent
        </button>

        {status === "idle" && (
          <p className="text-sm text-sky-300">
            Choose at least one bank to continue.
          </p>
        )}

        {status === "loading" && (
          <p className="text-sm text-sky-200 font-medium">
            Granting consent… ⏳
          </p>
        )}

        {status === "success" && (
          <p className="text-sm text-green-300 font-semibold">
            Consent approved ✅ Redirecting…
          </p>
        )}

        {status === "error" && (
          <p className="text-sm text-red-300 font-semibold">
            Consent failed ❌ Try again.
          </p>
        )}
      </div>

      {/* Back */}
      <div className="mt-10">
        <button
          onClick={() => navigate("/")}
          className="text-sm font-semibold text-sky-200 hover:text-sky-100 underline"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
