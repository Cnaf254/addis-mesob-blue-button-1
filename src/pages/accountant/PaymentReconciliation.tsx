
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Dummy reconciliation data
const reconciliations = [
  {
    ref: "TXN1001",
    memberId: "M001",
    loanId: "L001",
    expected: 1200,
    received: 1200,
    status: "Matched",
  },
  {
    ref: "TXN1002",
    memberId: "M002",
    loanId: "L002",
    expected: 900,
    received: 0,
    status: "Failed",
  },
  {
    ref: "TXN1003",
    memberId: "M003",
    loanId: "L003",
    expected: 1100,
    received: 900,
    status: "Mismatch",
  },
];

export default function PaymentReconciliation() {
  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-white">
      <h2 className="text-2xl font-bold mb-2">Payment Reconciliation</h2>
      <p className="mb-6 text-muted-foreground">Match bank data with system records. This is core accountant work.</p>

      <Card>
        <CardHeader>
          <CardTitle>Reconciliation Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bank Ref</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead>Loan ID</TableHead>
                <TableHead>Expected Amount</TableHead>
                <TableHead>Received Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reconciliations.map((r) => (
                <TableRow key={r.ref}>
                  <TableCell>{r.ref}</TableCell>
                  <TableCell>{r.memberId}</TableCell>
                  <TableCell>{r.loanId}</TableCell>
                  <TableCell>{r.expected} ETB</TableCell>
                  <TableCell>{r.received} ETB</TableCell>
                  <TableCell>
                    <span className={
                      r.status === "Matched"
                        ? "text-green-600 font-semibold"
                        : r.status === "Mismatch"
                        ? "text-yellow-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }>{r.status}</span>
                  </TableCell>
                  <TableCell>
                    {r.status === "Matched" && (
                      <Button size="sm" variant="outline">Approve</Button>
                    )}
                    {r.status === "Mismatch" && (
                      <Button size="sm" variant="outline">Investigate</Button>
                    )}
                    {r.status === "Failed" && (
                      <Button size="sm" variant="ghost">Retry</Button>
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
