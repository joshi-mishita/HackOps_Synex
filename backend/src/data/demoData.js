// backend/src/data/demoData.js

export const demoBanks = [
    { id: "hdfc", name: "HDFC Bank", balance: 45000 },
    { id: "icici", name: "ICICI Bank", balance: 32000 },
    { id: "sbi", name: "State Bank of India", balance: 0 },
  ];
  
  export const demoTransactions = [
    {
      id: "t1",
      title: "Monthly Salary",
      amount: 45000,
      type: "income",
      bank: "SBI Bank",
      category: "Salary",
      date: "2026-01-01",
    },
    {
      id: "t2",
      title: "Spotify",
      amount: 119,
      type: "expense",
      bank: "HDFC Bank",
      category: "Subscription",
      date: "2026-01-03",
    },
    {
      id: "t3",
      title: "Amazon",
      amount: 1999,
      type: "expense",
      bank: "HDFC Bank",
      category: "Shopping",
      date: "2026-01-04",
    },
    {
      id: "t4",
      title: "Uber",
      amount: 220,
      type: "expense",
      bank: "ICICI Bank",
      category: "Travel",
      date: "2026-01-05",
    },
  ];
  
  export const demoCategories = [
    "Salary",
    "Subscription",
    "Shopping",
    "Travel",
    "Food",
  ];
  