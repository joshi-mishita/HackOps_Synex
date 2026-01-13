import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ConnectBanks.css";

export default function ConnectBanks() {
  const navigate = useNavigate();
  const otpRefs = useRef([]);
  const startTimeRef = useRef(null);

  /* BANK DATA */
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

  /* STATE */
  const [selectedBank, setSelectedBank] = useState(null);
  const [status, setStatus] = useState("idle");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [attempts, setAttempts] = useState(0);
  const [latency, setLatency] = useState(null);
  const [consentId, setConsentId] = useState(null);
  const [expirySeconds, setExpirySeconds] = useState(30 * 24 * 60 * 60);

  /* UTILITIES */
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  function generateConsentId() {
    return (
      "AA-" +
      selectedBank?.toUpperCase() +
      "-" +
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
  }

  function downloadReceipt() {
    const data = {
      consentId,
      bank: selectedBank,
      issuedAt: new Date().toISOString(),
      expiresInSeconds: expirySeconds,
      latency,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "consent-receipt.json";
    a.click();
  }

  /* TIMERS */
  useEffect(() => {
    if (status === "otp" && timer > 0) {
      const i = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(i);
    }
  }, [status, timer]);

  useEffect(() => {
    if (status === "success" && expirySeconds > 0) {
      const i = setInterval(() => setExpirySeconds((e) => e - 1), 1000);
      return () => clearInterval(i);
    }
  }, [status, expirySeconds]);

  /* FLOW HANDLERS */
  async function handleConsent() {
    setStatus("redirect");
    startTimeRef.current = performance.now();
    await delay(1400);

    setConsentId(generateConsentId());
    setStatus("otp");
    setOtp("");
    setTimer(30);
    setAttempts(0);
    setTimeout(() => otpRefs.current[0]?.focus(), 120);
  }

  async function handleVerifyOTP() {
    if (attempts >= 2) {
      setStatus("locked");
      return;
    }

    setStatus("verifying");
    await delay(1100);

    if (otp === "123456") {
      const end = performance.now();
      setLatency(((end - startTimeRef.current) / 1000).toFixed(2));
      setStatus("success");
      setTimeout(() => navigate("/dashboard"), 3000);
    } else {
      setAttempts((a) => a + 1);
      setStatus("otp");
    }
  }

  function handleOtpChange(val, i) {
    if (!/^[0-9]?$/.test(val)) return;
    const arr = otp.split("");
    arr[i] = val;
    const nextOtp = arr.join("");
    setOtp(nextOtp);

    if (val && i < 5) otpRefs.current[i + 1]?.focus();
    if (!val && i > 0) otpRefs.current[i - 1]?.focus();
  }

  const otpFilled = otp.length === 6 && !otp.includes(undefined);

  return (
    <div className="consent-page">
      <div className="consent-container">
        {/* Banner */}
        <div className="demo-banner">
          <span className="demo-dot" />
          <span className="demo-title">Demo Mode</span>
          <span className="demo-sub">Simulated AA consent flow</span>
        </div>

        <h1 className="page-title">Account Aggregator Consent</h1>
        <p className="page-subtitle">
          Select a bank and grant consent to fetch balances & recent transactions.
        </p>

        {/* Bank list */}
        <div className="bank-list">
          {banks.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBank(b.id)}
              className={`bank-card ${selectedBank === b.id ? "active" : ""}`}
            >
              <p className="bank-name">{b.name}</p>
              <p className="bank-tag">Secure Gateway</p>
            </button>
          ))}
        </div>

        {/* Consent Info */}
        {selectedBank && (
          <div className="consent-info">
            <p className="consent-text">{bankConsentText[selectedBank]}</p>
            <p className="consent-badges">
              🔒 Low Risk · Read-only Access · 256-bit Encrypted
            </p>

            {status === "idle" && (
              <button className="primary-btn" onClick={handleConsent}>
                Grant Consent
              </button>
            )}
          </div>
        )}

        {status === "redirect" && (
          <div className="status-box">
            <div className="loader" />
            <p className="status-text">
              Redirecting to {selectedBank?.toUpperCase()} secure gateway…
            </p>
          </div>
        )}

        {/* OTP */}
        {status === "otp" && (
          <div className="otp-card">
            <h3 className="otp-title">Verify OTP</h3>
            <p className="otp-sub">
              Enter the 6-digit OTP sent to your registered mobile.
            </p>

            <div className="otp-box">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  maxLength="1"
                  value={otp[i] || ""}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="otp-input"
                />
              ))}
            </div>

            <button
              className="primary-btn"
              onClick={handleVerifyOTP}
              disabled={!otpFilled}
            >
              Verify OTP
            </button>

            <div className="otp-footer">
              <p>{timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}</p>
              <p>
                Demo OTP: <b>123456</b>
              </p>
            </div>
          </div>
        )}

        {status === "verifying" && (
          <div className="status-box">
            <div className="loader" />
            <p className="status-text">Verifying OTP…</p>
          </div>
        )}

        {status === "locked" && (
          <div className="error-box">
            Too many failed attempts. Please retry later.
          </div>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <div className="success-card">
            <div className="success-head">
              <div className="success-icon">✅</div>
              <div>
                <h2>Consent Granted</h2>
                <p>Redirecting you to dashboard…</p>
              </div>
            </div>

            <div className="success-grid">
              <div className="success-item">
                <p className="k">Consent ID</p>
                <p className="v">{consentId}</p>
              </div>

              <div className="success-item">
                <p className="k">Latency</p>
                <p className="v">{latency}s</p>
              </div>

              <div className="success-item">
                <p className="k">Expires In</p>
                <p className="v">{Math.floor(expirySeconds / 3600)} hours</p>
              </div>
            </div>

            <button className="secondary-btn" onClick={downloadReceipt}>
              Download Consent Receipt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
