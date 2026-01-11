import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ConnectBanks() {
  const navigate = useNavigate();
  const [connectedBanks, setConnectedBanks] = useState([]);

  const banks = ["Bank of India", "HDFC Bank", "SBI"];

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center">
      <div className="w-full max-w-md px-4 md:px-0 flex items-center">
        <div className="w-full bg-slate-800 rounded-xl p-6 shadow-xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Connect Banks
          </h2>

          <p className="text-slate-300 text-center mb-6">
            Click a bank to link your account
          </p>

          <div className="space-y-4">
            {["Bank of India", "HDFC Bank", "SBI"].map((bank) => (
              <div
                key={bank}
                className="flex justify-between items-center bg-slate-700 px-4 py-3 rounded-lg"
              >
                <span className="text-white">{bank}</span>
                <button
                  onClick={() =>
                    setConnectedBanks((prev) =>
                      prev.includes(bank) ? prev : [...prev, bank]
                    )
                  }
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold text-white ${
                    connectedBanks.includes(bank)
                      ? "bg-green-600"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {connectedBanks.includes(bank) ? "Connected" : "Connect"}
                </button>
              </div>
            ))}
          </div>

          {connectedBanks.length > 0 && (
            <button
              onClick={() =>
                navigate("/dashboard", { state: { connectedBanks } })
              }
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConnectBanks;
