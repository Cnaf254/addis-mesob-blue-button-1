// Statements.tsx

import { Button } from "@/components/ui/button";
import { useState } from "react";

const allStatements = [
  { id: 1, date: "2026-02-01", type: "Loan", desc: "Loan disbursement", amount: 9500 },
  { id: 2, date: "2026-02-01", type: "Repayment", desc: "Loan repayment", amount: -1500 },
  { id: 3, date: "2026-02-01", type: "Savings", desc: "Monthly savings", amount: 500 },
  { id: 4, date: "2026-01-01", type: "Repayment", desc: "Loan repayment", amount: -1500 },
  { id: 5, date: "2026-01-01", type: "Savings", desc: "Monthly savings", amount: 500 },
  { id: 6, date: "2025-12-01", type: "Loan", desc: "Loan disbursement", amount: 14000 },
];

const typeOptions = ["All", "Loan", "Savings", "Repayment"];

export default function Statements() {
  const [type, setType] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = allStatements.filter((s) => {
    const matchType = type === "All" || s.type === type;
    const matchFrom = !from || s.date >= from;
    const matchTo = !to || s.date <= to;
    return matchType && matchFrom && matchTo;
  });

  const handleDownload = () => {
    // Dummy PDF download
    alert("PDF download not implemented in demo.");
  };
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">Statements</h2>
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label className="block mb-1 font-medium">Transaction Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className="border rounded p-2">
            {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">From</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1 font-medium">To</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border rounded p-2" />
        </div>
        <Button variant="outline" onClick={handleDownload}>Download PDF</Button>
        <Button variant="secondary" onClick={handlePrint}>Print</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-2 text-center text-muted-foreground">No statements found.</td></tr>
            )}
            {filtered.map((row) => (
              <tr key={row.id} className="border-b last:border-b-0">
                <td className="px-4 py-2">{row.date}</td>
                <td className="px-4 py-2">{row.type}</td>
                <td className="px-4 py-2">{row.desc}</td>
                <td className={`px-4 py-2 font-semibold ${row.amount < 0 ? "text-red-600" : "text-green-700"}`}>{row.amount} ETB</td>
                <td className="px-4 py-2">
                  <Button variant="ghost" size="sm">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
