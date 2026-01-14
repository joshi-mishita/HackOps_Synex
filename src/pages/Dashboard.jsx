import { useMemo, useState, useEffect } from "react";
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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// ✅ mapping localStorage ids -> bank display names
const BANK_NAME = {
  hdfc: "HDFC Bank",
  icici: "ICICI Bank",
  sbi: "State Bank of India",
};

export default function Dashboard() {
  const [banks, setBanks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [connectedBanks, setConnectedBanks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bankFilter, setBankFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  // =========================
  // ✅ FETCH DASHBOARD DATA
  // =========================
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        // ✅ connected banks list from localStorage
        const connected = JSON.parse(
          localStorage.getItem("synex_connected_banks") || "[]"
        );
        setConnectedBanks(connected);

        // ✅ fetch full dashboard
        const res = await fetch(`${API_URL}/api/dashboard`);
        if (!res.ok) throw new Error("Backend error");
        const data = await res.json();

        const allBanks = data.banks || [];
        const allTxns = data.transactions || [];
        const allCats = data.categories || [];

        if (connected.length > 0) {
          // ✅ connected bank names
          const connectedNames = connected
            .map((id) => BANK_NAME[id])
            .filter(Boolean);

          // ✅ filter banks (backend should ideally send id also)
          const filteredBanks = allBanks.filter((b) =>
            connected.includes(b.id)
          );

          // ✅ filter transactions (txn.bank should be bank display name)
          const filteredTxns = allTxns.filter((t) =>
            connectedNames.includes(t.bank)
          );

          setBanks(filteredBanks);
          setTransactions(filteredTxns);
          setCategories(["All", ...allCats]);
        } else {
          // ✅ no connected -> show everything
          setBanks(allBanks);
          setTransactions(allTxns);
          setCategories(["All", ...allCats]);
        }
      } catch (e) {
        setError("❌ Backend not reachable. Start backend first.");
        setBanks([]);
        setTransactions([]);
        setCategories(["All"]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // =========================
  // ✅ TOTALS / SUMMARY
  // =========================
  const totalBalance = useMemo(
    () => banks.reduce((sum, b) => sum + (Number(b.balance) || 0), 0),
    [banks]
  );

  const incomeTotal = useMemo(() => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
  }, [transactions]);

  const expenseTotal = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
  }, [transactions]);

  // =========================
  // ✅ INSIGHTS
  // =========================
  const subscriptionInsight = useMemo(() => {
    const subsTotal = transactions
      .filter((t) => t.category === "Subscription" && t.type === "expense")
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);

    const percent = expenseTotal
      ? Math.round((subsTotal / expenseTotal) * 100)
      : 0;

    if (percent > 25) {
      return `You spend ${percent}% of your expenses on subscriptions — higher than normal.`;
    }
    return "Your subscription spending is under control.";
  }, [transactions, expenseTotal]);

  const cashflowInsight =
    expenseTotal > incomeTotal
      ? "Your expenses exceeded your income this month."
      : "Your income is higher than your expenses this month.";

  // =========================
  // ✅ FILTERED TRANSACTIONS
  // =========================
  const filteredTxns = useMemo(() => {
    return transactions.filter((t) => {
      const bankOk = bankFilter === "All" || t.bank === bankFilter;
      const catOk = categoryFilter === "All" || t.category === categoryFilter;
      return bankOk && catOk;
    });
  }, [transactions, bankFilter, categoryFilter]);

  // =========================
  // ✅ CHART DATA
  // =========================
  const categorySpend = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (t.type === "expense") {
        map[t.category] = (map[t.category] || 0) + (Number(t.amount) || 0);
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const bankBalances = useMemo(() => {
    return banks.map((b) => ({
      name: b.name?.split(" ")[0] || b.name,
      value: Number(b.balance) || 0,
    }));
  }, [banks]);

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

  const exportCSV = () => downloadCSV("synex_transactions.csv", filteredTxns);

  if (loading) {
    return <div className="p-10 text-sky-100">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold text-sky-50">Dashboard</h1>
      <p className="text-sky-200 mt-1">Unified financial overview</p>

      {/* ✅ Connected banks */}
      <p className="text-sky-200 mt-2 text-sm font-semibold">
        Connected Banks:{" "}
        {connectedBanks.length > 0
          ? connectedBanks.map((id) => BANK_NAME[id]).join(", ")
          : "None"}
      </p>

      {error && (
        <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-100 rounded-2xl p-4">
          {error}
        </div>
      )}

      {/* ✅ INSIGHTS */}
      <div className="mt-6 space-y-3">
        <div className="bg-sky-300/10 border border-sky-300/20 rounded-2xl p-4">
          <p className="text-sky-50 font-semibold">{subscriptionInsight}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-sky-50 font-semibold">{cashflowInsight}</p>
        </div>
      </div>

      {/* ✅ SUMMARY */}
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

        {/* ✅ PER BANK CARDS */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {banks.map((b) => (
            <div
              key={b.id || b.name}
              className="bg-white/5 border border-white/10 rounded-2xl p-4"
            >
              <p className="text-sky-200 font-semibold">{b.name}</p>
              <p className="text-2xl font-bold text-sky-50 mt-1">
                ₹{Number(b.balance || 0).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ FILTERS */}
      <div className="mt-8 flex flex-wrap gap-3">
        <select
          value={bankFilter}
          onChange={(e) => setBankFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sky-100"
        >
          <option value="All">All Banks</option>
          {[...new Set(transactions.map((t) => t.bank))].map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sky-100"
        >
          <option value="All">All Categories</option>
          {categories
            .filter((c) => c !== "All")
            .map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
        </select>
      </div>

      {/* ✅ CHARTS */}
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
                        [
                          "#7DD3FC",
                          "#38BDF8",
                          "#A78BFA",
                          "#34D399",
                          "#FBBF24",
                          "#FB7185",
                        ][i % 6]
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

      {/* ✅ EXPORT */}
      <div className="mt-8">
        <button
          onClick={exportCSV}
          className="px-5 py-3 rounded-xl bg-sky-300 text-slate-900 font-bold hover:bg-sky-200 transition"
        >
          Export CSV
        </button>
      </div>

      {/* ✅ TRANSACTIONS */}
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
              className="w-full text-left bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-sky-50">
                    {t.title || t.description}
                  </p>
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

          {filteredTxns.length === 0 && (
            <p className="text-sky-200 text-sm mt-2">No transactions found.</p>
          )}
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
