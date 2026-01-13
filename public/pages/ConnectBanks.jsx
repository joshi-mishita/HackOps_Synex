import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ConnectBanks() {
  const navigate = useNavigate();
  const otpRefs = useRef([]);
  const startTimeRef = useRef(null);

  /* ---------------- BANK DATA ---------------- */

  const banks = [
    { id: "hdfc", name: "HDFC Bank" },
    { id: "icici", name: "ICICI Bank" },
    { id: "sbi", name: "State Bank of India" }
  ];

  const bankConsentText = {
    hdfc: "HDFC will share last 12 months of transactions (read-only).",
    icici: "ICICI will share balances and statements.",
    sbi: "SBI requires additional verification."
  };

  /* ---------------- STATE ---------------- */

  const [selectedBank, setSelectedBank] = useState(null);
  const [status, setStatus] = useState("idle");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [attempts, setAttempts] = useState(0);
  const [latency, setLatency] = useState(null);
  const [consentId, setConsentId] = useState(null);
  const [expirySeconds, setExpirySeconds] = useState(30 * 24 * 60 * 60);

  /* ---------------- UTILITIES ---------------- */

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
      latency
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "consent-receipt.json";
    a.click();
  }

  /* ---------------- TIMERS ---------------- */

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

  /* ---------------- FLOW HANDLERS ---------------- */

  async function handleConsent() {
    setStatus("redirect");
    startTimeRef.current = performance.now();
    await delay(1500);

    setConsentId(generateConsentId());
    setStatus("otp");
    setOtp("");
    setTimer(30);
    setAttempts(0);

    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  }

  async function handleVerifyOTP() {
    if (attempts >= 2) {
      setStatus("locked");
      return;
    }

    setStatus("verifying");
    await delay(1200);

    if (otp === "123456") {
      const end = performance.now();
      setLatency(((end - startTimeRef.current) / 1000).toFixed(2));
      setStatus("success");
      setTimeout(() => navigate("/dashboard"), 4000);
    } else {
      setAttempts((a) => a + 1);
      setStatus("otp");
    }
  }

  function handleOtpChange(val, i) {
    if (!/^[0-9]?$/.test(val)) return;
    const arr = otp.split("");
    arr[i] = val;
    setOtp(arr.join(""));
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  }

  /* ---------------- UI ---------------- */

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      {/* DEMO BANNER */}
      <div style={{ background: "#eef2ff", padding: 10, borderRadius: 8 }}>
        🧪 Demo Mode — No real bank data is used
      </div>

      <h1 style={{ marginTop: 20 }}>Account Aggregator Consent</h1>

      {/* BANK SELECTION */}
      <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
        {banks.map((b) => (
          <div
            key={b.id}
            onClick={() => setSelectedBank(b.id)}
            style={{
              border:
                selectedBank === b.id
                  ? "2px solid #4f46e5"
                  : "1px solid #ccc",
              padding: 16,
              borderRadius: 12,
              cursor: "pointer",
              width: 180
            }}
          >
            <h3>{b.name}</h3>
          </div>
        ))}
      </div>

      {/* CONSENT INFO */}
      {selectedBank && (
        <div style={{ marginTop: 20 }}>
          <p><b>{bankConsentText[selectedBank]}</b></p>
          <p>🔒 Low Risk · Read-only Access</p>

          {status === "idle" && (
            <button onClick={handleConsent}>
              Grant Consent
            </button>
          )}
        </div>
      )}

      {status === "redirect" && (
        <p>Redirecting to {selectedBank?.toUpperCase()} secure gateway…</p>
      )}

      {/* OTP */}
      {status === "otp" && (
        <div style={{ marginTop: 20 }}>
          <h3>Verify OTP</h3>

          <div style={{ display: "flex", gap: 8 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <input
                key={i}
                ref={(el) => (otpRefs.current[i] = el)}
                maxLength="1"
                value={otp[i] || ""}
                onChange={(e) =>
                  handleOtpChange(e.target.value, i)
                }
                style={{
                  width: 40,
                  height: 50,
                  textAlign: "center"
                }}
              />
            ))}
          </div>

          <button onClick={handleVerifyOTP} style={{ marginTop: 10 }}>
            Verify OTP
          </button>

          <p style={{ fontSize: 12 }}>
            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </p>

          <p style={{ fontSize: 12 }}>
            Demo OTP: <b>123456</b>
          </p>
        </div>
      )}

      {status === "locked" && (
        <p style={{ color: "red" }}>
          Too many failed attempts. Please retry later.
        </p>
      )}

      {status === "verifying" && <p>Verifying OTP…</p>}

      {/* SUCCESS */}
      {status === "success" && (
        <div style={{ marginTop: 30, background: "#ecfdf5", padding: 20 }}>
          <h2>✅ Consent Granted</h2>
          <p><b>Consent ID:</b> {consentId}</p>
          <p><b>Latency:</b> {latency}s</p>
          <p>
            <b>Expires in:</b>{" "}
            {Math.floor(expirySeconds / 3600)} hours
          </p>

          <button onClick={downloadReceipt}>
            Download Consent Receipt
          </button>
        </div>
      )}
    </div>
  );
}
