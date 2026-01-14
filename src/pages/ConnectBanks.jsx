import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ConnectBanks.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function ConnectBanks() {
  const navigate = useNavigate();
  const otpRefs = useRef([]);
  const startTimeRef = useRef(null);

  const banks = [
    { id: "hdfc", name: "HDFC Bank" },
    { id: "icici", name: "ICICI Bank" },
    { id: "sbi", name: "State Bank of India" },
  ];

  const bankConsentText = {
    hdfc: "HDFC will share last 12 months of transactions (read-only).",
    icici: "ICICI will share balances and statements.",
    sbi: "SBI requires additional verification.",
  };

  const [selectedBank, setSelectedBank] = useState("hdfc");
  const [status, setStatus] = useState("idle");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [attempts, setAttempts] = useState(0);
  const [latency, setLatency] = useState(null);
  const [consentId, setConsentId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "otp" && timer > 0) {
      const i = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(i);
    }
  }, [status, timer]);

  function handleOtpChange(val, i) {
    if (!/^[0-9]?$/.test(val)) return;
    const arr = otp.split("");
    arr[i] = val;
    setOtp(arr.join(""));
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  }

  async function handleConsent() {
    try {
      setError("");
      setStatus("redirect");
      startTimeRef.current = performance.now();

      const res = await fetch(`${API_URL}/api/consent/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bank: selectedBank }),
      });

      if (!res.ok) throw new Error("Consent start failed");
      const data = await res.json();

      setConsentId(data.consentId);
      setStatus("otp");
      setOtp("");
      setTimer(30);
      setAttempts(0);

      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch {
      setStatus("error");
      setError("❌ Failed to fetch. Backend not reachable or CORS issue.");
    }
  }

  async function handleVerifyOTP() {
    if (attempts >= 2) {
      setStatus("locked");
      return;
    }

    try {
      setError("");
      setStatus("verifying");

      const res = await fetch(`${API_URL}/api/consent/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bank: selectedBank,
          otp,
          consentId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAttempts((a) => a + 1);
        setStatus("otp");
        setError(data?.message || "Invalid OTP");
        return;
      }

      const end = performance.now();
      setLatency(((end - startTimeRef.current) / 1000).toFixed(2));
      setStatus("success");

      // ✅ Store connected banks (MULTIPLE banks can be connected)
      const existing = JSON.parse(
        localStorage.getItem("synex_connected_banks") || "[]"
      );

      if (!existing.includes(selectedBank)) {
        existing.push(selectedBank);
      }

      localStorage.setItem("synex_connected_banks", JSON.stringify(existing));

      setTimeout(() => navigate("/dashboard"), 1200);
    } catch {
      setStatus("error");
      setError("❌ Verification failed. Check backend.");
    }
  }

  return (
    <div className="consent-page">
      <div className="demo-pill">Demo Mode — No real bank data is used</div>

      <h1 className="consent-title">Account Aggregator Consent</h1>
      <p className="consent-subtitle">
        Select a bank and grant consent to fetch balances & recent transactions.
      </p>

      <div className="bank-grid">
        {banks.map((b) => (
          <button
            type="button"
            key={b.id}
            onClick={() => {
              setSelectedBank(b.id);
              setStatus("idle");
              setError("");
            }}
            className={`bank-card ${selectedBank === b.id ? "active" : ""}`}
          >
            <div className="bank-name">{b.name}</div>
            <div className="bank-sub">Secure Gateway</div>
          </button>
        ))}
      </div>

      <div className="consent-info">
        <div className="consent-text">{bankConsentText[selectedBank]}</div>
        <div className="consent-meta">
          🔒 Low Risk · Read-only Access · 256-bit Encrypted
        </div>

        {status === "idle" && (
          <button className="primary-btn" onClick={handleConsent}>
            Grant Consent
          </button>
        )}

        {status === "redirect" && (
          <div className="spinner">Redirecting to secure bank gateway…</div>
        )}

        {status === "error" && <div className="error-box">{error}</div>}
      </div>

      {(status === "otp" || status === "verifying") && (
        <div className="otp-card">
          <h2>Verify OTP</h2>
          <p>Enter the 6-digit OTP sent to your registered mobile.</p>

          <div className="otp-inputs">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <input
                key={i}
                ref={(el) => (otpRefs.current[i] = el)}
                className="otp-box"
                maxLength="1"
                value={otp[i] || ""}
                onChange={(e) => handleOtpChange(e.target.value, i)}
              />
            ))}
          </div>

          <div className="otp-actions">
            <button
              className="primary-btn"
              onClick={handleVerifyOTP}
              disabled={status === "verifying" || otp.length !== 6}
            >
              {status === "verifying" ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="otp-resend">
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </div>
            <div className="otp-demo">
              Demo OTP: <b>123456</b>
            </div>
          </div>

          {error ? <div className="error-inline">{error}</div> : null}
        </div>
      )}

      {status === "locked" && (
        <div className="error-box">Too many attempts. Try again later.</div>
      )}

      {status === "success" && (
        <div className="success-card">
          <h2>✅ Consent Granted</h2>
          <div className="success-grid">
            <div>
              <b>Consent ID:</b> {consentId}
            </div>
            <div>
              <b>Latency:</b> {latency}s
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
