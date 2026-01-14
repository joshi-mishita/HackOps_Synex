import { useMemo, useState } from "react";
import { banks, transactions, categories } from "../data/mockData";
import TransactionDrawer from "../components/TransactionDrawer";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [bankFilter, setBankFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  // ====== TOTALS ======
  const totalBalance = useMemo(
    () => banks.reduce((sum, b) => sum + b.balance, 0),
    []
  );

  const incomeTotal = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0),
    []
  );

  const expenseTotal = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0),
    []
  );

  // ====== FILTERED TRANSACTIONS ======
  const filteredTxns = useMemo(() => {
    return transactions.filter((t) => {
      const bankOk = bankFilter === "All" || t.bank === bankFilter;
      const catOk = categoryFilter === "All" || t.category === categoryFilter;
      return bankOk && catOk;
    });
  }, [bankFilter, categoryFilter]);

  // ====== INSIGHT ======
  const insight = useMemo(() => {
    const subsTotal = transactions
      .filter((t) => t.category === "Subscription" && t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    const percent = expenseTotal
      ? Math.round((subsTotal / expenseTotal) * 100)
      : 0;

    if (percent > 25) {
      return `You spend ${percent}% of your expenses on subscriptions — higher than normal.`;
    }
    return "Your subscription spending is under control.";
  }, [expenseTotal]);

  // ====== CHART DATA ======
  const categorySpend = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (t.type === "expense") {
        map[t.category] = (map[t.category] || 0) + t.amount;
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, []);

  const bankBalances = useMemo(
    () => banks.map((b) => ({ name: b.name, value: b.balance })),
    []
  );

  const tooltipStyle = {
    contentStyle: {
      background: "#071626",
      borderRadius: "12px",
      color: "#E0F2FE",
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-sky-50">Dashboard</h1>
      <p className="text-sky-200 mt-1">Unified financial overview</p>

      {/* INSIGHT */}
      <div className="mt-6 bg-sky-300/10 border border-sky-300/20 rounded-2xl p-4">
        <p className="text-sky-50 font-semibold">{insight}</p>
      </div>

      {/* SUMMARY */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-6">
        <p className="text-sky-200">Total Balance</p>
        <h2 className="text-4xl font-extrabold text-sky-50 mt-1">
          ₹{totalBalance.toLocaleString("en-IN")}
        </h2>

        {/* INCOME VS EXPENSE */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-green-500/10 rounded-xl p-3">
            <p className="text-green-300 text-sm">Monthly Income</p>
            <p className="text-2xl font-bold text-green-400">
              ₹{incomeTotal.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="bg-red-500/10 rounded-xl p-3">
            <p className="text-red-300 text-sm">Monthly Expense</p>
            <p className="text-2xl font-bold text-red-400">
              ₹{expenseTotal.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* BANK CARDS */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {banks.map((b) => (
            <div
              key={b.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-4"
            >
              <p className="text-sky-200 font-semibold">{b.name}</p>
              <p className="text-2xl font-bold text-sky-50 mt-1">
                ₹{b.balance.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CHARTS */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-xl font-bold text-sky-50">
            Category-wise Spending
          </h3>
          <div className="mt-6 h-[250px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categorySpend} dataKey="value" nameKey="name">
                  {categorySpend.map((_, i) => (
                    <Cell
                      key={i}
                      fill={
                        ["#7DD3FC", "#38BDF8", "#A78BFA", "#34D399"][i % 4]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-xl font-bold text-sky-50">Bank-wise Balance</h3>
          <div className="mt-6 h-[250px]">
            <ResponsiveContainer>
              <BarChart data={bankBalances}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#BAE6FD" />
                <YAxis stroke="#BAE6FD" />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" fill="#7DD3FC" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="mt-8">
        <p className="text-sky-200 font-semibold mb-2">Filter Transactions</p>
        <div className="flex gap-4">
          <select
            value={bankFilter}
            onChange={(e) => setBankFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sky-50"
          >
            <option>All</option>
            {banks.map((b) => (
              <option key={b.id}>{b.name}</option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sky-50"
          >
            <option>All</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-6">
        <h3 className="text-xl font-bold text-sky-50">Transactions</h3>

        <div className="mt-4 space-y-3">
          {filteredTxns.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTxn(t);
                setDrawerOpen(true);
              }}
              className="w-full text-left bg-white/5 border border-white/10 rounded-2xl p-4"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-sky-50">{t.description}</p>
                  <p className="text-sm text-sky-200">
                    {t.date} • {t.bank} • {t.category}
                  </p>
                </div>
                <p
                  className={`font-bold ${
                    t.type === "expense"
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {t.type === "expense" ? "-" : "+"}₹{t.amount}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <TransactionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        txn={selectedTxn}
      />
    </div>
  );
}
