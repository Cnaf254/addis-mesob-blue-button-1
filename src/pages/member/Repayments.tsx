// Repayments.tsx

import { Button } from "@/components/ui/button";
import { useState } from "react";

const activeLoans = [
  {
    id: "LN001",
    type: "Personal",
    balance: 4200,
    nextDue: { date: "2026-03-01", amount: 1500 },
  },
  {
    id: "LN003",
    type: "Business",
    balance: 14000,
    nextDue: { date: "2026-03-10", amount: 2000 },
  },
];

const repaymentHistory = [
  {
    date: "2026-02-01",
    amount: 1500,
    method: "Mobile",
    ref: "TXN12345",
    status: "Confirmed",
  },
  {
    date: "2026-01-01",
    amount: 1500,
    method: "Bank",
    ref: "TXN12222",
    status: "Confirmed",
  },
  {
    date: "2025-12-01",
    amount: 1500,
    method: "Cash",
    ref: "TXN11111",
    status: "Pending",
  },
];

export default function Repayments() {
  const [selectedLoan, setSelectedLoan] = useState(activeLoans[0]?.id || "");
  const [payment, setPayment] = useState({ amount: "", method: "", proof: null });
  const [showProof, setShowProof] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleLoanChange = (e) => {
    setSelectedLoan(e.target.value);
  };

  const handlePaymentChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setPayment({ ...payment, proof: files });
    } else {
      setPayment({ ...payment, [name]: value });
    }
    if (name === "method") {
      setShowProof(value === "Cash" || value === "Bank");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">Repayments</h2>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Active Loans</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {activeLoans.map((loan) => (
            <div key={loan.id} className={`border rounded p-4 ${selectedLoan === loan.id ? "border-blue-500" : "border-gray-200"}`}>
              <div className="font-semibold">Loan ID: {loan.id}</div>
              <div>Type: {loan.type}</div>
              <div>Outstanding Balance: <span className="font-bold">{loan.balance} ETB</span></div>
              <div>Next Due: <span className="font-bold">{loan.nextDue.date}</span> (<span className="font-bold">{loan.nextDue.amount} ETB</span>)</div>
              <Button variant={selectedLoan === loan.id ? "default" : "outline"} size="sm" className="mt-2" onClick={() => setSelectedLoan(loan.id)}>
                {selectedLoan === loan.id ? "Selected" : "Select"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Make a Repayment</h3>
        {submitted ? (
          <div className="p-4 bg-green-100 rounded text-green-700 mb-4">Repayment submitted! Awaiting confirmation.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Amount</label>
              <input type="number" name="amount" value={payment.amount} onChange={handlePaymentChange} required min={1} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Payment Method</label>
              <select name="method" value={payment.method} onChange={handlePaymentChange} required className="w-full border rounded p-2">
                <option value="">Select method</option>
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>
            {showProof && (
              <div>
                <label className="block mb-1 font-medium">Upload Payment Proof</label>
                <input type="file" name="proof" onChange={handlePaymentChange} className="w-full border rounded p-2" />
              </div>
            )}
            <Button type="submit" variant="default">Submit Repayment</Button>
          </form>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Repayment History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border bg-white rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Amount Paid</th>
                <th className="px-4 py-2 text-left">Method</th>
                <th className="px-4 py-2 text-left">Reference #</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {repaymentHistory.map((r, i) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="px-4 py-2">{r.date}</td>
                  <td className="px-4 py-2">{r.amount} ETB</td>
                  <td className="px-4 py-2">{r.method}</td>
                  <td className="px-4 py-2 font-mono">{r.ref}</td>
                  <td className={`px-4 py-2 font-semibold ${r.status === "Confirmed" ? "text-green-600" : "text-yellow-600"}`}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
