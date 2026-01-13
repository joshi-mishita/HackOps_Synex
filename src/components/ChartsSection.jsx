import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
  } from "recharts";
  
  export default function ChartsSection({ banks = [], transactions = [] }) {
    // 1) Bank-wise balances for bar chart
    const bankBalanceData = banks.map((b) => ({
      name: b.name,
      balance: b.balance,
    }));
  
    // 2) Category-wise spending for pie chart
    const spendingByCategory = transactions
      .filter((t) => t.amount < 0) // only expenses
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        return acc;
      }, {});
  
    const categoryData = Object.entries(spendingByCategory).map(
      ([category, value]) => ({
        name: category,
        value,
      })
    );
  
    // fallback if no expenses
    const hasPieData = categoryData.length > 0;
  
    // theme colors
    const PIE_COLORS = ["#7DD3FC", "#38BDF8", "#22C55E", "#FBBF24", "#FB7185"];
  
    // Tooltip theme styling (FIXES BLACK TEXT ISSUE)
    const tooltipStyles = {
      contentStyle: {
        background: "rgba(11, 28, 45, 0.96)", // dark navy
        border: "1px solid rgba(186, 230, 253, 0.18)", // soft sky border
        borderRadius: "14px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        color: "#E0F2FE",
        padding: "10px 12px",
      },
      labelStyle: {
        color: "#E0F2FE",
        fontWeight: 700,
        marginBottom: "6px",
      },
      itemStyle: {
        color: "#BAE6FD",
        fontWeight: 600,
      },
      cursor: { fill: "rgba(125, 211, 252, 0.08)" }, // hover highlight
    };
  
    return (
      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        {/* Pie Chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-sky-50">Spending by Category</h3>
          <p className="text-sky-200 text-sm mt-1">
            Expense distribution across categories
          </p>
  
          <div className="h-72 mt-4">
            {hasPieData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={4}
                  >
                    {categoryData.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
  
                  {/* Tooltip fixed */}
                  <Tooltip
                    contentStyle={tooltipStyles.contentStyle}
                    labelStyle={tooltipStyles.labelStyle}
                    itemStyle={tooltipStyles.itemStyle}
                    cursor={tooltipStyles.cursor}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sky-200">
                No spending data available
              </div>
            )}
          </div>
        </div>
  
        {/* Bar Chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-sky-50">Bank-wise Balance</h3>
          <p className="text-sky-200 text-sm mt-1">
            Compare balances across connected banks
          </p>
  
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bankBalanceData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.08)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#BAE6FD", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#BAE6FD", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                />
  
                {/* Tooltip fixed */}
                <Tooltip
                  contentStyle={tooltipStyles.contentStyle}
                  labelStyle={tooltipStyles.labelStyle}
                  itemStyle={tooltipStyles.itemStyle}
                  cursor={tooltipStyles.cursor}
                />
  
                <Bar
                  dataKey="balance"
                  radius={[10, 10, 0, 0]}
                  fill="#7DD3FC"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
  