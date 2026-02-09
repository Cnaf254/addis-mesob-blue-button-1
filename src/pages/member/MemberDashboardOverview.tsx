// MemberDashboardOverview.tsx
// Dashboard summary for member

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

// Dummy data for demonstration
const member = {
  name: "Abebe Kebede",
  id: "MEM12345",
  status: "Active",
  savings: 8500,
  activeLoans: 2,
  outstandingLoanBalance: 12000,
  nextRepayment: {
    date: "2026-03-01",
    amount: 1500,
  },
  unreadNotifications: 3,
};

export default function MemberDashboardOverview() {
  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-white">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
        <p className="mb-6 text-muted-foreground">Quick personal snapshot of your account.</p>
        <div className="flex flex-wrap gap-6 items-center mb-6">
          <Card className="min-w-[220px]">
            <CardContent className="pt-6">
              <div className="mb-2">
                <span className="text-sm text-muted-foreground">Member Name</span>
                <p className="text-lg font-bold text-foreground">{member.name}</p>
              </div>
              <div className="mb-2">
                <span className="text-sm text-muted-foreground">Member ID</span>
                <p className="text-lg font-mono text-foreground">{member.id}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Status</span>
                <p className={`text-lg font-bold ${member.status === "Active" ? "text-green-600" : "text-red-600"}`}>{member.status}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="min-w-[220px]">
            <CardContent className="pt-6">
              <span className="text-sm text-muted-foreground">Total Savings Balance</span>
              <p className="text-2xl font-bold text-foreground">{member.savings} ETB</p>
            </CardContent>
          </Card>
          <Card className="min-w-[220px]">
            <CardContent className="pt-6">
              <span className="text-sm text-muted-foreground">Active Loan Count</span>
              <p className="text-2xl font-bold text-foreground">{member.activeLoans}</p>
            </CardContent>
          </Card>
          <Card className="min-w-[220px]">
            <CardContent className="pt-6">
              <span className="text-sm text-muted-foreground">Outstanding Loan Balance</span>
              <p className="text-2xl font-bold text-foreground">{member.outstandingLoanBalance} ETB</p>
            </CardContent>
          </Card>
          <Card className="min-w-[220px]">
            <CardContent className="pt-6">
              <span className="text-sm text-muted-foreground">Next Repayment Due</span>
              <p className="text-lg font-bold text-foreground">{member.nextRepayment.date}</p>
              <span className="text-sm text-muted-foreground">Amount</span>
              <p className="text-xl font-bold text-foreground">{member.nextRepayment.amount} ETB</p>
            </CardContent>
          </Card>
          <Card className="min-w-[220px]">
            <CardContent className="pt-6">
              <span className="text-sm text-muted-foreground">Unread Notifications</span>
              <p className="text-2xl font-bold text-foreground">{member.unreadNotifications}</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex gap-4 mt-4">
          <Link to="/dashboard/apply-loan">
            <Button variant="default">Apply for Loan</Button>
          </Link>
          <Link to="/dashboard/repayments">
            <Button variant="secondary">Make Repayment</Button>
          </Link>
          <Link to="/dashboard/statements">
            <Button variant="outline">View Statements</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
