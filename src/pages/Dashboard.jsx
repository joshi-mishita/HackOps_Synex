import { useLocation, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const connectedBanks = location.state?.connectedBanks || [];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Dashboard
        </h2>

        {connectedBanks.length === 0 ? (
          <p className="text-slate-300 text-center">
            No banks connected
          </p>
        ) : (
          <div className="space-y-4">
            {connectedBanks.map((bank) => (
              <div
                key={bank}
                className="flex justify-between items-center bg-slate-700 rounded-lg px-4 py-3"
              >
                <span className="text-white">{bank}</span>
                <span className="text-green-400 font-medium">Linked</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate("/connect")}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Add More Banks
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
