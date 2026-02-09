import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const loans = [
  { member: "Abebe Kebede", id: "M001", type: "Short-term", amount: 10000, date: "2026-02-02", status: "Pending" },
  { member: "Almaz Tesfaye", id: "M002", type: "Long-term", amount: 25000, date: "2026-02-04", status: "Pending" },
];

export default function LoanApplications() {
  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-white">
      <h2 className="text-2xl font-bold mb-2">Loan Applications</h2>
      <p className="mb-6 text-muted-foreground">First-level review of loan requests.</p>
      <Card>
        <CardHeader><CardTitle>Loan Requests</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member Name</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead>Loan Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Application Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((l, i) => (
                <TableRow key={i}>
                  <TableCell>{l.member}</TableCell>
                  <TableCell>{l.id}</TableCell>
                  <TableCell>{l.type}</TableCell>
                  <TableCell>{l.amount} ETB</TableCell>
                  <TableCell>{l.date}</TableCell>
                  <TableCell><span className="text-yellow-600 font-semibold">{l.status}</span></TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">Approve</Button>
                    <Button size="sm" variant="ghost" className="ml-2">Reject</Button>
                    <Button size="sm" variant="ghost" className="ml-2">Return</Button>
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
