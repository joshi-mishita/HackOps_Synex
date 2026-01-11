import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "60px", textAlign: "center" }}>
      <h1>Synex</h1>
      <p>One secure view of all your finances</p>

      <button
        onClick={() => navigate("/connect-banks")}
        style={{
          marginTop: "30px",
          padding: "12px 24px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Get Started
      </button>
    </div>
  );
}

export default Landing;
