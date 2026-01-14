import express from "express";
import { banks, transactions, categories } from "../data/mockData.js";

const router = express.Router();

// Dashboard API
router.get("/dashboard", (req, res) => {
  const totalBalance = banks.reduce((sum, b) => sum + b.balance, 0);
  res.json({ totalBalance, banks });
});

// Transactions API
router.get("/transactions", (req, res) => {
  res.json({ transactions, categories });
});

// Consent API
router.post("/consent", (req, res) => {
  const { bankId } = req.body;

  const consentId =
    "AA-" +
    (bankId || "BANK").toUpperCase() +
    "-" +
    Math.random().toString(36).substring(2, 8).toUpperCase();

  res.json({
    message: "Consent granted ✅",
    consentId,
  });
});

export default router;
