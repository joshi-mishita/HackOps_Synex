import { useState } from "react";
import InsightCard from "../components/InsightCard";
import TransactionItem from "../components/TransactionItem";
import { transactions } from "../data/mockData";

export default function Transactions() {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.bank === filter);

  const subscriptionSpend = transactions
    .filter((t) => t.category === "Subscription")
    .reduce((sum, t) => sum + t.amount, 0);

  const insights = [
    subscriptionSpend > 500 &&
      "You spend more than ₹500/month on subscriptions",
    "Reducing subscriptions can save up to 15% monthly",
  ].filter(Boolean);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Transactions</h1>

      <select
        className="border p-2 rounded"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All Banks</option>
        <option value="HDFC">HDFC</option>
        <option value="ICICI">ICICI</option>
        <option value="SBI">SBI</option>
      </select>

      {insights.map((text, idx) => (
        <InsightCard key={idx} text={text} />
      ))}

      <div className="bg-white p-4 rounded-xl shadow">
        {filtered.map((tx) => (
          <TransactionItem key={tx.id} tx={tx} />
        ))}
      </div>
    </div>
  );
}
