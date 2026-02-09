import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


// Dummy financial stats for demonstration
const stats = {
  totalSavings: 1250000, // ETB
  activeLoans: 850000, // ETB
  paymentsToday: 42,
  paymentsMonth: 780,
  failedPayments: 2,
  pendingPayments: 5,
};


export default function AccountantDashboardOverview() {
  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-white">
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">💼 Accountant Dashboard</h2>
        <p className="text-muted-foreground mb-4">Quick financial overview.</p>
      </div>
      {/* Financial Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <span className="font-bold text-lg">₵</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Total Savings Balance</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalSavings.toLocaleString()} ETB</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-800">
                <span className="font-bold text-lg">💳</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Active Loan Balance</p>
              <p className="text-2xl font-bold text-foreground">{stats.activeLoans.toLocaleString()} ETB</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-yellow-100 text-yellow-800">
                <span className="font-bold text-lg">✔️</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Payments Processed Today</p>
              <p className="text-2xl font-bold text-foreground">{stats.paymentsToday}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">Payments This Month</p>
              <p className="text-lg font-semibold text-foreground">{stats.paymentsMonth}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-yellow-50 text-yellow-800">
                <span className="font-bold text-lg">⏳</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Failed Payments</p>
              <p className="text-2xl font-bold text-foreground">{stats.failedPayments}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">Pending Payments</p>
              <p className="text-lg font-semibold text-foreground">{stats.pendingPayments}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Alerts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              <li>Failed salary deductions: <span className="font-semibold">0</span></li>
              <li>Pending manual payments: <span className="font-semibold">2</span></li>
              <li>Reconciliation mismatches: <span className="font-semibold">1</span></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
