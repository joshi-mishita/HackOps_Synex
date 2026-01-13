import { useMemo, useState } from "react";
import { banks, transactions, categories } from "../data/mockData";
import { downloadCSV } from "../utils/csv";
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

  // Savings goal
  const [savedAmount, setSavedAmount] = useState(
    Number(localStorage.getItem("synex_saved")) || 27000
  );
  const goal = 100000;

  const totalBalance = useMemo(() => {
    return banks.reduce((sum, b) => sum + b.balance, 0);
  }, []);

  const filteredTxns = useMemo(() => {
    return transactions.filter((t) => {
      const bankOk = bankFilter === "All" || t.bank === bankFilter;
      const catOk = categoryFilter === "All" || t.category === categoryFilter;
      return bankOk && catOk;
    });
  }, [bankFilter, categoryFilter]);

  // Insight banner (rule-based)
  const insight = useMemo(() => {
    const food = transactions
      .filter((t) => t.category === "Food" && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    if (food > 1500) return `You spent ₹${food} on Food recently — consider setting a limit.`;
    return `Your spending is stable. Consider adding a savings goal for better planning.`;
  }, []);

  // Bank Health
  const bankHealth = [
    { bank: "HDFC Bank", status: "Connected", tone: "good" },
    { bank: "ICICI Bank", status: "Sync delayed (3h)", tone: "warn" },
    { bank: "SBI Bank", status: "Connected", tone: "good" },
  ];

  // Alerts panel
  const alerts = [
    { type: "ok", msg: "Rent paid successfully ✅" },
    { type: "warn", msg: "Uber spending spike detected ⚠️" },
    { type: "ok", msg: "Netflix renewal completed ✅" },
  ];

  // Charts Data
  const categorySpend = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (t.type === "expense") {
        map[t.category] = (map[t.category] || 0) + t.amount;
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, []);

  const bankBalances = useMemo(() => {
    return banks.map((b) => ({ name: b.name.split(" ")[0], value: b.balance }));
  }, []);

  // Theme tooltip style (not black)
  const tooltipStyle = {
    contentStyle: {
      background: "rgba(7, 22, 38, 0.96)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "12px",
      color: "#E0F2FE",
    },
    labelStyle: { color: "#BAE6FD", fontWeight: 700 },
    itemStyle: { color: "#7DD3FC" },
  };

  const onTxnClick = (txn) => {
    setSelectedTxn(txn);
    setDrawerOpen(true);
  };

  const addSavings = (amt) => {
    const next = savedAmount + amt;
    setSavedAmount(next);
    localStorage.setItem("synex_saved", String(next));
  };

  const exportCSV = () => {
    downloadCSV("synex_transactions.csv", filteredTxns);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold text-sky-50">Dashboard</h1>
      <p className="mt-2 text-sky-200">
        Unified balances, transactions history and insights.
      </p>

      {/* Insight Banner */}
      <div className="mt-8 bg-sky-300/10 border border-sky-300/20 rounded-2xl p-5">
        <p className="text-sky-50 mt-1 font-bold">{insight}</p>
      </div>

      {/* Summary */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-8">
        <p className="text-sky-200 font-semibold">Total Balance</p>
        <p className="mt-1 text-5xl font-extrabold text-sky-50">
          ₹{totalBalance.toLocaleString("en-IN")}
        </p>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {banks.map((b) => (
            <div
              key={b.name}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <p className="text-sky-200 font-semibold">{b.name}</p>
              <p className="mt-1 text-3xl font-bold text-sky-50">
                ₹{b.balance.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bank Health + Savings goal */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {/* Bank health */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-7">
          <h2 className="text-xl font-bold text-sky-50">Bank Health</h2>
          <div className="mt-6 space-y-4">
            {bankHealth.map((b) => (
              <div
                key={b.bank}
                className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4"
              >
                <p className="text-sky-100 font-semibold">{b.bank}</p>
                <p
                  className={`text-sm font-bold ${
                    b.tone === "good"
                      ? "text-green-300"
                      : "text-yellow-300"
                  }`}
                >
                  {b.status}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Savings */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-7">
          <h2 className="text-xl font-bold text-sky-50">Savings Goal</h2>
          <p className="mt-1 text-sky-200">
            Emergency Fund ₹{goal.toLocaleString("en-IN")}
          </p>

          <div className="mt-6">
            <div className="flex justify-between text-sm text-sky-200 font-semibold">
              <span>Saved</span>
              <span>₹{savedAmount.toLocaleString("en-IN")}</span>
            </div>

            <div className="mt-3 h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-sky-300"
                style={{ width: `${Math.min(100, (savedAmount / goal) * 100)}%` }}
              />
            </div>

            <div className="mt-6 flex gap-3 flex-wrap">
              <button
                onClick={() => addSavings(1000)}
                className="px-4 py-2 rounded-xl bg-sky-300 text-slate-900 font-bold hover:bg-sky-200 transition"
              >
                + Add ₹1000
              </button>
              <button
                onClick={() => addSavings(5000)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sky-100 font-bold hover:bg-white/10 transition"
              >
                + Add ₹5000
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-7">
        <h2 className="text-xl font-bold text-sky-50">Recent Alerts</h2>
        <div className="mt-6 space-y-3">
          {alerts.map((a, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-4 border ${
                a.type === "warn"
                  ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-100"
                  : "bg-green-500/10 border-green-500/20 text-green-100"
              }`}
            >
              <p className="font-semibold">{a.msg}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-7">
          <h2 className="text-xl font-bold text-sky-50">
            Category-wise Spending
          </h2>

          <div className="mt-6 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categorySpend} dataKey="value" nameKey="name" outerRadius={90}>
                  {categorySpend.map((_, i) => (
                    <Cell key={i} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-7">
          <h2 className="text-xl font-bold text-sky-50">Bank-wise Balance</h2>

          <div className="mt-6 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bankBalances}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#BAE6FD" />
                <YAxis stroke="#BAE6FD" />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filters + Export */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4">
          <select
            value={bankFilter}
            onChange={(e) => setBankFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sky-50 font-semibold"
          >
            <option>All</option>
            {banks.map((b) => (
              <option key={b.name}>{b.name}</option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sky-50 font-semibold"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          onClick={exportCSV}
          className="px-5 py-3 rounded-xl bg-sky-300 text-slate-900 font-bold hover:bg-sky-200 transition"
        >
          Export CSV
        </button>
      </div>

      {/* Transactions */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-7">
        <h2 className="text-2xl font-bold text-sky-50">Transactions</h2>
        <p className="text-sky-200 mt-1">Recent activity across banks</p>

        <div className="mt-6 space-y-4">
          {filteredTxns.map((t) => (
            <button
              key={t.id}
              onClick={() => onTxnClick(t)}
              className="w-full text-left bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-sky-50">{t.title}</p>
                  <p className="text-sky-200 text-sm mt-1">
                    {t.date} • {t.bank} • {t.category}
                  </p>
                </div>

                <p
                  className={`text-xl font-extrabold ${
                    t.type === "expense" ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {t.type === "expense" ? "-" : "+"}₹{t.amount}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Drawer */}
      <TransactionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        txn={selectedTxn}
      />
    </div>
  );
}
