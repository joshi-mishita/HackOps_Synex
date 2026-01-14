// backend/src/routes/consentRoutes.js
import express from "express";

const router = express.Router();

// ✅ in-memory store (demo)
const activeConsents = new Map();

/**
 * POST /api/consent/start
 * body: { bank: "hdfc" }
 */
router.post("/start", (req, res) => {
  const { bank } = req.body;

  if (!bank) {
    return res.status(400).json({ message: "Bank is required" });
  }

  const consentId =
    "AA-" +
    bank.toUpperCase() +
    "-" +
    Math.random().toString(36).slice(2, 8).toUpperCase();

  activeConsents.set(consentId, {
    bank,
    createdAt: Date.now(),
    verified: false,
  });

  return res.json({
    consentId,
    message: "Consent initiated",
  });
});

/**
 * POST /api/consent/verify
 * body: { bank, otp, consentId }
 */
router.post("/verify", (req, res) => {
  const { bank, otp, consentId } = req.body;

  if (!bank || !otp || !consentId) {
    return res.status(400).json({ message: "bank, otp, consentId required" });
  }

  const record = activeConsents.get(consentId);
  if (!record) return res.status(404).json({ message: "Consent not found" });

  if (record.bank !== bank) {
    return res.status(400).json({ message: "Bank mismatch" });
  }

  // ✅ Demo OTP
  if (otp !== "123456") {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  record.verified = true;
  activeConsents.set(consentId, record);

  return res.json({
    success: true,
    consentId,
    bank,
    message: "Consent verified successfully",
  });
});

export default router;
