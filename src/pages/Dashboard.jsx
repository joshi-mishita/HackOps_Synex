import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { banks as mockBanks, transactions as mockTransactions, categories } from "../data/mockData";
import ChartsSection from "../components/ChartsSection";
import EmptyState from "../components/EmptyState";
import { Skeleton } from "../components/Skeleton";

export default function Dashboard() {
  const navigate = useNavigate();

  // LOADING STATE (fake API delay)
  const [loading, setLoading] = useState(true);

  // Filter state
  const [bankFilter, setBankFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400); // smooth demo
    return () => clearTimeout(timer);
  }, []);

  // Total balance
  const totalBalance = useMemo(() => {
    return mockBanks.reduce((sum, bank) => sum + bank.balance, 0);
  }, []);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((t) => {
      const bankOk = bankFilter === "All" || t.bank === bankFilter;
      const catOk = categoryFilter === "All" || t.category === categoryFilter;
      return bankOk && catOk;
    });
  }, [bankFilter, categoryFilter]);

  // Empty case
  const noData = mockBanks.length === 0 || mockTransactions.length === 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-sky-50">Dashboard</h1>
          <p className="mt-2 text-sky-200">
            Unified balances, transaction history and insights.
          </p>
        </div>

        <button
          onClick={() => navigate("/connect")}
          className="px-5 py-3 rounded-xl bg-white/10 border border-white/10 text-sky-50 font-semibold hover:bg-white/15 transition"
        >
          + Connect More Banks
        </button>
      </div>

      {/* LOADING SKELETON */}
      {loading ? (
        <div className="mt-10 space-y-6">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-72 w-full rounded-2xl" />
            <Skeleton className="h-72 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      ) : noData ? (
        // Empty State
        <div className="mt-10">
          <EmptyState
            title="No dashboard data yet"
            description="Connect your banks to view unified balance, transactions and spending insights."
            actionLabel="Connect Banks"
            onAction={() => navigate("/connect")}
          />
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-7 shadow-sm">
            <p className="text-sky-200 font-semibold">Total Balance</p>
            <h2 className="text-5xl font-bold text-sky-50 mt-3">
              ₹{totalBalance.toLocaleString("en-IN")}
            </h2>

            <div className="mt-7 grid md:grid-cols-2 gap-4">
              {mockBanks.map((bank) => (
                <div
                  key={bank.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5"
                >
                  <p className="text-sky-100 font-semibold">{bank.name}</p>
                  <p className="text-3xl font-bold text-sky-50 mt-2">
                    ₹{bank.balance.toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="mt-10 flex gap-4 flex-wrap">
            <select
              value={bankFilter}
              onChange={(e) => setBankFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sky-50"
            >
              <option className="text-slate-900">All</option>
              {mockBanks.map((b) => (
                <option className="text-slate-900" key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sky-50"
            >
              {categories.map((cat) => (
                <option className="text-slate-900" key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Transactions */}
          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-sky-50">Transactions</h3>
              <p className="text-sky-200 text-sm mt-1">
                Recent activity across connected banks
              </p>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="p-10 text-center text-sky-200">
                No transactions found for selected filters.
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {filteredTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-6"
                  >
                    <div>
                      <p className="text-sky-50 font-semibold">{t.title}</p>
                      <p className="text-sky-200 text-sm mt-1">
                        {t.date} • {t.bank} • {t.category}
                      </p>
                    </div>
                    <p
                      className={`text-lg font-bold ${
                        t.amount < 0 ? "text-red-300" : "text-green-300"
                      }`}
                    >
                      {t.amount < 0 ? "-" : "+"}₹{Math.abs(t.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Charts Section */}
          <ChartsSection banks={mockBanks} transactions={mockTransactions} />
        </>
      )}
    </div>
  );
}
