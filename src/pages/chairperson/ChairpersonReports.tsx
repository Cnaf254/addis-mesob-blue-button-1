import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const reports = [
  { type: "Membership Approval Summary", description: "Summary of all membership approvals." },
  { type: "Loan Approval vs Rejection", description: "Comparison of loan approvals and rejections." },
  { type: "Decision Turnaround Time", description: "Average time to decision." },
];

export default function ChairpersonReports() {
  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-white">
      <h2 className="text-2xl font-bold mb-2">Reports (Chairperson)</h2>
      <p className="mb-6 text-muted-foreground">Governance-level reporting.</p>
      <Card>
        <CardHeader><CardTitle>Report Types</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Button>Export PDF</Button>
            <Button variant="outline">Export Excel</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report, i) => (
                <TableRow key={i}>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
