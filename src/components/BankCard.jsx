export default function BankCard({ name, balance }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-gray-600">{name}</h3>
      <p className="text-xl font-bold">₹{balance}</p>
    </div>
  );
}
