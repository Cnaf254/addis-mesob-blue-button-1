
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Dummy loan payments data
const payments = [
  {
    loanId: "L001",
    member: "Abebe Kebede",
    monthly: 1200,
    status: "Paid",
    nextDue: "2026-03-01",
    manualPending: false,
    overdue: false,
  },
  {
    loanId: "L002",
    member: "Almaz Tesfaye",
    monthly: 900,
    status: "Pending",
    nextDue: "2026-02-10",
    manualPending: true,
    overdue: true,
  },
];

export default function LoanPayments() {
  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-white">
      <h2 className="text-2xl font-bold mb-2">Loan Payments</h2>
      <p className="mb-6 text-muted-foreground">Track and verify loan repayments.</p>

      <Card>
        <CardHeader>
          <CardTitle>Loan Repayments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member Name</TableHead>
                <TableHead>Loan ID</TableHead>
                <TableHead>Monthly Installment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.loanId}>
                  <TableCell>{p.member}</TableCell>
                  <TableCell>{p.loanId}</TableCell>
                  <TableCell>{p.monthly} ETB</TableCell>
                  <TableCell>
                    <span className={p.status === "Paid" ? "text-green-600 font-semibold" : p.overdue ? "text-red-600 font-semibold" : "text-yellow-600 font-semibold"}>{p.status}{p.overdue && " (Overdue)"}</span>
                  </TableCell>
                  <TableCell>{p.nextDue}</TableCell>
                  <TableCell>
                    {p.manualPending && (
                      <Button size="sm" variant="outline">Verify Manual</Button>
                    )}
                    {p.status === "Pending" && (
                      <Button size="sm" variant="outline" className="ml-2">Mark Confirmed</Button>
                    )}
                    {p.overdue && (
                      <Button size="sm" variant="ghost" className="ml-2">Flag Overdue</Button>
                    )}
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
