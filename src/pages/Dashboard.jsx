import { useMemo, useState } from "react";
import { banks, transactions, categories } from "../data/mockData";

export default function Dashboard() {
  const totalBalance = useMemo(() => {
    return banks.reduce((sum, bank) => sum + bank.balance, 0);
  }, []);

  const [bankFilter, setBankFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const bankOk = bankFilter === "All" || t.bank === bankFilter;
      const catOk = categoryFilter === "All" || t.category === categoryFilter;
      return bankOk && catOk;
    });
  }, [bankFilter, categoryFilter]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-sky-50">Dashboard</h1>
      <p className="mt-2 text-sky-200">
        Unified balances, transaction history and insights.
      </p>

      {/* Summary */}
      <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-sm">
        <p className="text-sm text-sky-300">Total Balance</p>
        <p className="text-4xl font-bold mt-2 text-sky-50">
          ₹{totalBalance.toLocaleString("en-IN")}
        </p>

        {/* Bank Cards */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {banks.map((bank) => (
            <div
              key={bank.id}
              className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              <p className="text-sm text-sky-300">{bank.name}</p>
              <p className="text-2xl font-bold mt-1 text-sky-50">
                ₹{bank.balance.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <select
          value={bankFilter}
          onChange={(e) => setBankFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sky-50"
        >
          <option value="All">All Banks</option>
          {banks.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sky-50"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All Categories" : c}
            </option>
          ))}
        </select>
      </div>

      {/* Transactions */}
      <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-white/10">
          <h2 className="text-lg font-semibold text-sky-50">Transactions</h2>
          <p className="text-sm text-sky-300">Recent activity across banks</p>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="p-6 text-sky-200">No transactions found.</div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredTransactions.map((t) => (
              <div
                key={t.id}
                className="p-5 flex items-center justify-between hover:bg-white/10 transition"
              >
                <div>
                  <p className="font-semibold text-sky-50">{t.merchant}</p>
                  <p className="text-sm text-sky-300">
                    {t.date} • {t.bank} • {t.category}
                  </p>
                </div>

                <p
                  className={`font-bold ${
                    t.amount < 0 ? "text-red-300" : "text-green-300"
                  }`}
                >
                  {t.amount < 0 ? "-" : "+"}₹
                  {Math.abs(t.amount).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
