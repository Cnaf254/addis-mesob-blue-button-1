import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const approved = [
  { type: "Membership", name: "Abebe Kebede", date: "2026-02-01", next: "Active Member" },
  { type: "Loan", name: "Almaz Tesfaye", date: "2026-02-04", next: "Accountant Review" },
];

export default function ApprovedRequests() {
  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-white">
      <h2 className="text-2xl font-bold mb-2">Approved Requests</h2>
      <p className="mb-6 text-muted-foreground">Tracking & transparency. Read-only.</p>
      <Card>
        <CardHeader><CardTitle>Approved</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Approval Date</TableHead>
                <TableHead>Next Step</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approved.map((a, i) => (
                <TableRow key={i}>
                  <TableCell>{a.type}</TableCell>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.date}</TableCell>
                  <TableCell>{a.next}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
