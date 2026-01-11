import "./ConnectBanks.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ConnectBanks() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const banks = ["Bank of India", "HDFC Bank", "SBI"];

  const handleConsent = () => {
    setLoading(true);

    // Fake AA consent processing
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center">
      <div className="w-full max-w-md px-4 md:px-0 flex items-center">
        <div className="w-full bg-slate-800 rounded-xl p-6 shadow-xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Connect Your Bank Accounts
          </h2>

          <p className="text-slate-300 text-center mb-6 text-sm">
            Securely link your accounts via RBI-regulated Account Aggregator
          </p>

          <div className="space-y-4">
            {banks.map((bank) => (
              <div
                key={bank}
                className="flex justify-between items-center bg-slate-700 px-4 py-3 rounded-lg"
              >
                <span className="text-white">{bank}</span>
                <span className="text-xs text-slate-300">
                  Available
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={handleConsent}
            disabled={loading}
            className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Granting Consent..." : "Grant Consent"}
          </button>

          {loading && (
            <p className="text-center text-slate-400 text-sm mt-4">
              Connecting securely via Account Aggregator…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConnectBanks;
