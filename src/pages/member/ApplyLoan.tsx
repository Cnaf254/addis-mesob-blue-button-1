// ApplyLoan.tsx

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { applyLoan } from "@/lib/api/loans";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const loanTypes = {
  short_term: { label: "Short Term", interest: 1.5 },
  long_term: { label: "Long Term", interest: 1.0 },
  holiday: { label: "Holiday", interest: 2.0 },
};

export default function ApplyLoan() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    loanType: "",
    amount: "",
    period: "",
    purpose: "",
  });

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Calculate repayment
  const calculateRepayment = (amount: string, period: string, type: string) => {
    if (!amount || !period || !type) return 0;

    const principal = parseFloat(amount);
    const months = parseInt(period);
    const interestRate = loanTypes[type as keyof typeof loanTypes].interest;

    const totalInterest = (principal * interestRate * months) / 100;
    const total = principal + totalInterest;

    return Math.round(total / months);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    setForm(newForm);

    const repayment = calculateRepayment(
      name === "amount" ? value : newForm.amount,
      name === "period" ? value : newForm.period,
      name === "loanType" ? value : newForm.loanType
    );

    setMonthlyPayment(repayment);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Please login first.");
      return;
    }

    try {
      // Fetch member_id from backend or context (for demo, assume user.id is member_id)
      const member_id = user.id;
      const principal = parseFloat(form.amount);
      const months = parseInt(form.period);
      const interestRate = loanTypes[form.loanType as keyof typeof loanTypes].interest;
      const totalInterest = (principal * interestRate * months) / 100;
      const totalAmount = principal + totalInterest;

      await applyLoan({
        member_id,
        loan_type: form.loanType,
        principal_amount: principal,
        term_months: months,
        interest_rate: interestRate,
        total_amount: totalAmount,
        monthly_payment: totalAmount / months,
        remaining_balance: totalAmount,
        purpose: form.purpose,
        status: "pending_approval",
      });

      setSubmitted(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError("Failed to submit application.");
    }
  };

  if (submitted) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">Application Submitted</h2>
        <p>Your loan request is now <span className="font-semibold text-yellow-600">Pending Approval</span>.</p>
        <p className="mt-2">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-2xl font-bold mb-4">Apply for Loan</h2>

      {error && <div className="text-red-600 mb-3">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Loan Type</label>
          <select
            name="loanType"
            value={form.loanType}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          >
            <option value="">Select type</option>
            {Object.entries(loanTypes).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label} ({val.interest}% monthly)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Requested Amount (ETB)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            min={1000}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Repayment Period (months)</label>
          <input
            type="number"
            name="period"
            value={form.period}
            onChange={handleChange}
            required
            min={1}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Purpose of Loan</label>
          <textarea
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Estimated Monthly Payment</label>
          <div className="p-2 bg-gray-100 rounded font-semibold">
            {monthlyPayment ? `${monthlyPayment} ETB` : "-"}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Submit Application
        </Button>
      </form>
    </div>
  );
}
