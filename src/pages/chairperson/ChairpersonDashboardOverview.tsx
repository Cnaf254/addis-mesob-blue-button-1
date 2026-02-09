import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = {
  pendingMemberships: 4,
  pendingLoans: 7,
  approvedToday: 2,
  approvedMonth: 12,
  rejectedToday: 1,
  rejectedMonth: 3,
};

export default function ChairpersonDashboardOverview() {
  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-white">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Chairperson Dashboard</h2>
        <p className="mb-6 text-muted-foreground">High-level oversight of pending decisions.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card><CardContent className="pt-6"><div className="mt-4"><p className="text-sm text-muted-foreground">Pending Membership Approvals</p><p className="text-2xl font-bold text-foreground">{stats.pendingMemberships}</p></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="mt-4"><p className="text-sm text-muted-foreground">Pending Loan Applications</p><p className="text-2xl font-bold text-foreground">{stats.pendingLoans}</p></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="mt-4"><p className="text-sm text-muted-foreground">Approved Today</p><p className="text-2xl font-bold text-foreground">{stats.approvedToday}</p></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="mt-4"><p className="text-sm text-muted-foreground">Approved This Month</p><p className="text-2xl font-bold text-foreground">{stats.approvedMonth}</p></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="mt-4"><p className="text-sm text-muted-foreground">Rejected Today</p><p className="text-2xl font-bold text-foreground">{stats.rejectedToday}</p></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="mt-4"><p className="text-sm text-muted-foreground">Rejected This Month</p><p className="text-2xl font-bold text-foreground">{stats.rejectedMonth}</p></div></CardContent></Card>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Alerts</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              <li>High-value loan applications: <span className="font-semibold">1</span></li>
              <li>Long-pending requests (SLA warning): <span className="font-semibold">2</span></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
