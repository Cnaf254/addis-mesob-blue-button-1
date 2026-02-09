import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const applicants = [
  { name: "Abebe Kebede", date: "2026-02-01", docs: "Complete", status: "Pending" },
  { name: "Almaz Tesfaye", date: "2026-02-03", docs: "Missing ID", status: "Pending" },
];

export default function MembershipApprovals() {
  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-white">
      <h2 className="text-2xl font-bold mb-2">Membership Approvals</h2>
      <p className="mb-6 text-muted-foreground">Approve or reject new member registrations.</p>
      <Card>
        <CardHeader><CardTitle>Applicants</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Application Date</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((a, i) => (
                <TableRow key={i}>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.date}</TableCell>
                  <TableCell>{a.docs}</TableCell>
                  <TableCell><span className="text-yellow-600 font-semibold">{a.status}</span></TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline" className="ml-2">Approve</Button>
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
