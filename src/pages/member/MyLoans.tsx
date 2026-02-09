// MyLoans.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ================= TYPES ================= */
type Loan = {
  id: string;
  type: string;
  principal: number;
  approved: number;
  interest: number;
  status: "Pending" | "Approved" | "Active" | "Completed" | "Rejected";
  startDate: string;
  balance: number;
};

/* ================= MOCK DATA ================= */
const loans: Loan[] = [
  {
    id: "LN001",
    type: "Personal",
    principal: 10000,
    approved: 9500,
    interest: 8.5,
    status: "Active",
    startDate: "2025-06-01",
    balance: 4200,
  },
  {
    id: "LN002",
    type: "Car",
    principal: 20000,
    approved: 20000,
    interest: 7.2,
    status: "Completed",
    startDate: "2023-01-15",
    balance: 0,
  },
  {
    id: "LN003",
    type: "Business",
    principal: 15000,
    approved: 14000,
    interest: 9.0,
    status: "Pending",
    startDate: "2026-01-10",
    balance: 14000,
  },
];

/* ================= STATUS COLORS ================= */
const statusColors: Record<Loan["status"], string> = {
  Pending: "text-yellow-600",
  Approved: "text-blue-600",
  Active: "text-green-600",
  Completed: "text-gray-600",
  Rejected: "text-red-600",
};

/* ================= COMPONENT ================= */
export default function MyLoans() {
  const [dialog, setDialog] = useState<{
    type: "details" | "schedule" | "agreement" | "";
    loan: Loan | null;
  }>({ type: "", loan: null });

  const openDialog = (type: "details" | "schedule" | "agreement", loan: Loan) => {
    setDialog({ type, loan });
  };

  const closeDialog = () => {
    setDialog({ type: "", loan: null });
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">My Loans</h2>

      {/* Loans Table */}
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="min-w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left">Loan ID</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Principal</th>
              <th className="px-4 py-3 text-left">Approved</th>
              <th className="px-4 py-3 text-left">Interest</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Start Date</th>
              <th className="px-4 py-3 text-left">Balance</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id} className="border-t">
                <td className="px-4 py-2 font-mono">{loan.id}</td>
                <td className="px-4 py-2">{loan.type}</td>
                <td className="px-4 py-2">{loan.principal.toLocaleString()} ETB</td>
                <td className="px-4 py-2">{loan.approved.toLocaleString()} ETB</td>
                <td className="px-4 py-2">{loan.interest}%</td>
                <td className={`px-4 py-2 font-semibold ${statusColors[loan.status]}`}>
                  {loan.status}
                </td>
                <td className="px-4 py-2">{loan.startDate}</td>
                <td className="px-4 py-2">{loan.balance.toLocaleString()} ETB</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDialog("details", loan)}
                    >
                      Details
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openDialog("schedule", loan)}
                    >
                      Schedule
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openDialog("agreement", loan)}
                    >
                      Agreement
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialog */}
      <Dialog open={!!dialog.type} onOpenChange={closeDialog}>
        <DialogContent>
          {dialog.type === "details" && dialog.loan && (
            <>
              <DialogHeader>
                <DialogTitle>Loan Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <p><strong>Loan ID:</strong> {dialog.loan.id}</p>
                <p><strong>Type:</strong> {dialog.loan.type}</p>
                <p><strong>Principal:</strong> {dialog.loan.principal} ETB</p>
                <p><strong>Approved:</strong> {dialog.loan.approved} ETB</p>
                <p><strong>Interest:</strong> {dialog.loan.interest}%</p>
                <p><strong>Status:</strong> {dialog.loan.status}</p>
                <p><strong>Start Date:</strong> {dialog.loan.startDate}</p>
                <p><strong>Remaining Balance:</strong> {dialog.loan.balance} ETB</p>
              </div>
              <Button className="mt-4 w-full" onClick={closeDialog}>
                Close
              </Button>
            </>
          )}

          {dialog.type === "schedule" && dialog.loan && (
            <>
              <DialogHeader>
                <DialogTitle>Repayment Schedule</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <p>2025-07-01 — 1,000 ETB — Paid</p>
                <p>2025-08-01 — 1,000 ETB — Due</p>
                <p>2025-09-01 — 1,000 ETB — Upcoming</p>
              </div>
              <Button className="mt-4 w-full" onClick={closeDialog}>
                Close
              </Button>
            </>
          )}

          {dialog.type === "agreement" && dialog.loan && (
            <>
              <DialogHeader>
                <DialogTitle>Loan Agreement</DialogTitle>
              </DialogHeader>
              <p className="text-sm mb-4">
                Download the loan agreement for <strong>{dialog.loan.id}</strong>.
              </p>
              <Button
                className="w-full mb-2"
                onClick={() => {
                  alert(`Agreement downloaded for ${dialog.loan.id}`);
                  closeDialog();
                }}
              >
                Download PDF
              </Button>
              <Button variant="outline" className="w-full" onClick={closeDialog}>
                Cancel
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
