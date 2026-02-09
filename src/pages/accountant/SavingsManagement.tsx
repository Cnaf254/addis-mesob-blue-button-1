
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Dummy member savings data
const savings = [
  {
    id: "M001",
    name: "Abebe Kebede",
    monthly: 500,
    balance: 8500,
    status: "Active",
    initialVerified: false,
    adjustmentPending: true,
  },
  {
    id: "M002",
    name: "Almaz Tesfaye",
    monthly: 700,
    balance: 12000,
    status: "Suspended",
    initialVerified: true,
    adjustmentPending: false,
  },
];

export default function SavingsManagement() {
  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-white">
      <h2 className="text-2xl font-bold mb-2">Savings Management</h2>
      <p className="mb-6 text-muted-foreground">Manage member savings transactions. Accountant verifies, does not change rules.</p>

      <Card>
        <CardHeader>
          <CardTitle>Member Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member Name</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead>Monthly Amount</TableHead>
                <TableHead>Current Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savings.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.id}</TableCell>
                  <TableCell>{s.monthly} ETB</TableCell>
                  <TableCell>{s.balance} ETB</TableCell>
                  <TableCell>
                    <span className={s.status === "Active" ? "text-green-600 font-semibold" : "text-yellow-600 font-semibold"}>{s.status}</span>
                  </TableCell>
                  <TableCell>
                    {!s.initialVerified && (
                      <Button size="sm" variant="outline">Verify Initial</Button>
                    )}
                    {s.adjustmentPending && (
                      <Button size="sm" variant="outline" className="ml-2">Approve Adjustment</Button>
                      )}
                    <Button size="sm" variant="ghost" className="ml-2">View History</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
