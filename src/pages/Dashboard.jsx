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

  // ====== INSIGHTS ======
  const subscriptionInsight = useMemo(() => {
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

  const cashflowInsight =
    expenseTotal > incomeTotal
      ? "Your expenses exceeded your income this month."
      : "Your income is higher than your expenses this month.";

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

      {/* INSIGHTS */}
      <div className="mt-6 space-y-3">
        <div className="bg-sky-300/10 border border-sky-300/20 rounded-2xl p-4">
          <p className="text-sky-50 font-semibold">{subscriptionInsight}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-sky-50 font-semibold">{cashflowInsight}</p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-6">
        <p className="text-sky-200">Total Balance</p>
        <h2 className="text-4xl font-extrabold text-sky-50 mt-1">
          ₹{totalBalance.toLocaleString("en-IN")}
        </h2>

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

      {/* TRANSACTIONS */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-6">
        <h3 className="text-xl font-bold text-sky-50">Transactions</h3>

        <div className="mt-4 space-y-3 max-h-[350px] overflow-y-auto">
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
