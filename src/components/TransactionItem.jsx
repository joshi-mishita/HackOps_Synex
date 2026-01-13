export default function TransactionItem({ tx }) {
  return (
    <div className="flex justify-between border-b py-2">
      <div>
        <p className="font-medium">{tx.description}</p>
        <p className="text-sm text-gray-500">
          {tx.bank} • {tx.category}
        </p>
      </div>
      <p className={tx.type === "income" ? "text-green-600" : "text-red-600"}>
        {tx.type === "income" ? "+" : "-"}₹{tx.amount}
      </p>
    </div>
  );
}
