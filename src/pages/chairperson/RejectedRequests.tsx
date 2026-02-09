import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const rejected = [
  { type: "Membership", name: "Bekele Alemu", reason: "Incomplete documents", date: "2026-02-02" },
  { type: "Loan", name: "Mulu Habte", reason: "Not eligible", date: "2026-02-03" },
];

export default function RejectedRequests() {
  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-white">
      <h2 className="text-2xl font-bold mb-2">Rejected Requests</h2>
      <p className="mb-6 text-muted-foreground">Audit & accountability. Read-only.</p>
      <Card>
        <CardHeader><CardTitle>Rejected</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Decision Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rejected.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.reason}</TableCell>
                  <TableCell>{r.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
