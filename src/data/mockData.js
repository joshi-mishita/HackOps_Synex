export const banks = [
  { id: 1, name: "HDFC Bank", balance: 42000 },
  { id: 2, name: "ICICI Bank", balance: 28000 },
  { id: 3, name: "SBI Bank", balance: 15000 },
];

export const transactions = [
  {
    id: 1,
    bank: "HDFC Bank",
    type: "expense",
    category: "Subscription",
    description: "Netflix",
    amount: 799,
    date: "2026-01-01",
  },
  {
    id: 2,
    bank: "ICICI Bank",
    type: "expense",
    category: "Food",
    description: "Swiggy",
    amount: 450,
    date: "2026-01-02",
  },
  {
    id: 3,
    bank: "SBI Bank",
    type: "income",
    category: "Salary",
    description: "Monthly Salary",
    amount: 45000,
    date: "2026-01-01",
  },
  {
    id: 4,
    bank: "HDFC Bank",
    type: "expense",
    category: "Subscription",
    description: "Spotify",
    amount: 119,
    date: "2026-01-03",
  },
  {
    id: 5,
    bank: "HDFC Bank",
    type: "expense",
    category: "Shopping",
    description: "Amazon",
    amount: 1999,
    date: "2026-01-04",
  },
  {
    id: 6,
    bank: "ICICI Bank",
    type: "expense",
    category: "Travel",
    description: "Uber",
    amount: 220,
    date: "2026-01-05",
  },
];

export const categories = [
  "All",
  "Subscription",
  "Food",
  "Shopping",
  "Travel",
  "Salary",
];
