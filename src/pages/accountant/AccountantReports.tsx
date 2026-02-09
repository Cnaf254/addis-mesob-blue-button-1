
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const reports = [
  { type: "Savings Summary", description: "Overview of all member savings." },
  { type: "Loan Repayment", description: "Details of loan repayments by members." },
  { type: "Outstanding Loans", description: "Current outstanding loan balances." },
  { type: "Failed Payments", description: "Report of failed payment transactions." },
  { type: "Monthly Financial Summary", description: "Summary of all financial activity for the month." },
];

export default function AccountantReports() {
  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-white">
      <h2 className="text-2xl font-bold mb-2">Reports (Accountant)</h2>
      <p className="mb-6 text-muted-foreground">Financial reporting & audit support.</p>

      <Card>
        <CardHeader>
          <CardTitle>Report Types</CardTitle>
        </CardHeader>
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
