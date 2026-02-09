import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Dummy data for demonstration
const reports = [
  { type: "User Activity", description: "Tracks user logins and actions." },
  { type: "Role Usage", description: "Distribution of roles in the system." },
  { type: "Login Frequency", description: "How often users log in." },
  { type: "Failed Logins", description: "Failed login attempts." },
  { type: "Approval Actions", description: "Approval action counts by role." },
];

export default function AdminReports() {
  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-white">
      <h2 className="text-2xl font-bold mb-2">Reports (Admin)</h2>
      <p className="mb-6 text-muted-foreground">System usage & access analysis (not financial approvals).</p>
      <Card>
        <CardHeader>
          <CardTitle>Report Types</CardTitle>
          <CardDescription>Export as PDF or Excel</CardDescription>
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
