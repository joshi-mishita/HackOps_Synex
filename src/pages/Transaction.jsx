import { useState } from "react";
import { transactions } from "../data/mockData";
import TransactionItem from "../components/TransactionItem";

export default function Transactions() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? transactions
    : transactions.filter(t => t.bank === filter);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Transactions</h1>

      <select
        className="border p-2 rounded"
        onChange={e => setFilter(e.target.value)}
      >
        <option value="all">All Banks</option>
        <option value="HDFC">HDFC</option>
        <option value="ICICI">ICICI</option>
        <option value="SBI">SBI</option>
      </select>

      <div className="bg-white p-4 rounded-xl shadow">
        {filtered.map(tx => (
          <TransactionItem key={tx.id} tx={tx} />
        ))}
      </div>
    </div>
  );
}
