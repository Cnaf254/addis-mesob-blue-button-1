import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Users, XCircle } from "lucide-react";

// Dummy stats for demonstration
const stats = {
  totalUsers: 120,
  activeUsers: 98,
  rolesCount: 6,
  suspendedUsers: 3,
};

export default function AdminDashboardOverview() {
  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-white">
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">👑 Admin Dashboard</h2>
        <p className="text-muted-foreground mb-4">System health & access overview.</p>
      </div>
      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-800">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold text-foreground">{stats.activeUsers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-yellow-100 text-yellow-800">
                <Badge className="h-6 w-6 flex items-center justify-center">R</Badge>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Roles Count</p>
              <p className="text-2xl font-bold text-foreground">{stats.rolesCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-yellow-50 text-yellow-800">
                <XCircle className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Suspended Users</p>
              <p className="text-2xl font-bold text-foreground">{stats.suspendedUsers}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* System Status */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="default">Bank API status</Badge>
                <span className="text-green-600 font-semibold">Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Last successful backup</Badge>
                <span>2026-02-05 10:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Last login activity</Badge>
                <span>2026-02-05 09:45</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Security Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              <li>Failed login attempts: <span className="font-semibold">0</span></li>
              <li>Role changes made recently: <span className="font-semibold">0</span></li>
              <li>Locked or suspended accounts: <span className="font-semibold">0</span></li>
            </ul>
          </CardContent>
        </Card>
      </div>
      {/* Quick Actions */}
      <div className="flex gap-4 mb-8">
        <Button>Add User</Button>
        <Button variant="outline">Assign Role</Button>
      </div>
    </div>
  );
}
