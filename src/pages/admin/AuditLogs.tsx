import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Dummy data for demonstration
const logs = [
  { timestamp: "2026-02-05 10:00", user: "John Doe", role: "Admin", action: "Changed role", entity: "User", ip: "192.168.1.1" },
  { timestamp: "2026-02-05 09:45", user: "Jane Smith", role: "Accountant", action: "Login failed", entity: "Login", ip: "192.168.1.2" },
];

export default function AuditLogs() {
  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-white">
      <h2 className="text-2xl font-bold mb-2">Audit Logs</h2>
      <p className="mb-6 text-muted-foreground">Security, compliance, and accountability. Logs are read-only and immutable.</p>
      <Card>
        <CardHeader>
          <CardTitle>Log Table</CardTitle>
          <CardDescription>All system actions are recorded</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Affected Entity</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, i) => (
                <TableRow key={i}>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.role}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.entity}</TableCell>
                  <TableCell>{log.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
