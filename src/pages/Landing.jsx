import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-10 min-h-screen flex items-center">
        <div>
          <h1 className="text-6xl font-bold text-white mb-4">
            Synex
          </h1>

          <p className="text-slate-300 text-xl mb-8 max-w-xl">
            One secure view of all your finances
          </p>

          <button
            onClick={() => navigate("/connect")}
            className="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-200"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
