// backend/src/routes/dashboardRoutes.js
import express from "express";
import { demoBanks, demoTransactions, demoCategories } from "../data/demoData.js";

const router = express.Router();

/**
 * GET /api/dashboard?bank=hdfc
 */
router.get("/", (req, res) => {
  const connected = req.query.bank; // hdfc/icici/sbi

  let banks = demoBanks;
  let txns = demoTransactions;

  if (connected) {
    banks = demoBanks.filter((b) => b.id === connected);

    const bankName =
      connected === "hdfc"
        ? "HDFC Bank"
        : connected === "icici"
        ? "ICICI Bank"
        : connected === "sbi"
        ? "SBI Bank"
        : null;

    if (bankName) {
      txns = demoTransactions.filter((t) => t.bank === bankName);
    }
  }

  res.json({
    banks,
    transactions: txns,
    categories: demoCategories,
  });
});

export default router;
