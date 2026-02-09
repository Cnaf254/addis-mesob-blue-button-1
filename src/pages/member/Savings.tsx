// Savings.tsx


const savingsSummary = {
  total: 8500,
  monthly: 500,
  lastDate: "2026-02-01",
  type: "Mandatory",
};

const savingsHistory = [
  { date: "2026-02-01", amount: 500, type: "Mandatory", method: "Bank" },
  { date: "2026-01-01", amount: 500, type: "Mandatory", method: "Mobile" },
  { date: "2025-12-01", amount: 1000, type: "Voluntary", method: "Cash" },
  { date: "2025-11-01", amount: 500, type: "Mandatory", method: "Bank" },
];

export default function Savings() {
  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Savings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="border rounded p-4">
          <div className="text-sm text-muted-foreground">Total Savings Balance</div>
          <div className="text-2xl font-bold">{savingsSummary.total} ETB</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-sm text-muted-foreground">Monthly Contribution</div>
          <div className="text-xl font-bold">{savingsSummary.monthly} ETB</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-sm text-muted-foreground">Last Contribution Date</div>
          <div className="text-lg font-bold">{savingsSummary.lastDate}</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-sm text-muted-foreground">Savings Type</div>
          <div className="text-lg font-bold">{savingsSummary.type}</div>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">Savings History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Contribution Type</th>
              <th className="px-4 py-2 text-left">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {savingsHistory.map((row, i) => (
              <tr key={i} className="border-b last:border-b-0">
                <td className="px-4 py-2">{row.date}</td>
                <td className="px-4 py-2">{row.amount} ETB</td>
                <td className="px-4 py-2">{row.type}</td>
                <td className="px-4 py-2">{row.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
