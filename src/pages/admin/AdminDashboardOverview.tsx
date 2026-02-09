import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCheck, Users, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardStats, useSystemStatus, useSecurityAlerts } from "@/hooks/useAdminApi";

export default function AdminDashboardOverview() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: systemStatus, isLoading: statusLoading } = useSystemStatus();
  const { data: securityAlerts, isLoading: alertsLoading } = useSecurityAlerts();

  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-background">
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
              {statsLoading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : statsError ? (
                <p className="text-destructive text-sm">Failed to load</p>
              ) : (
                <p className="text-2xl font-bold text-foreground">{stats?.totalUsers ?? 0}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-accent text-accent-foreground">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Active Users</p>
              {statsLoading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-bold text-foreground">{stats?.activeUsers ?? 0}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-secondary text-secondary-foreground">
                <Badge className="h-6 w-6 flex items-center justify-center">R</Badge>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Roles Count</p>
              {statsLoading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-bold text-foreground">{stats?.rolesCount ?? 0}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-muted text-muted-foreground">
                <XCircle className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Suspended Users</p>
              {statsLoading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-bold text-foreground">{stats?.suspendedUsers ?? 0}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status & Security Alerts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            {statusLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Bank API status</Badge>
                  <span className={systemStatus?.bankApiStatus === 'connected' ? 'text-green-600 font-semibold' : 'text-destructive font-semibold'}>
                    {systemStatus?.bankApiStatus === 'connected' ? 'Connected' : systemStatus?.bankApiStatus ?? 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Last successful backup</Badge>
                  <span>{systemStatus?.lastBackup ?? 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Last login activity</Badge>
                  <span>{systemStatus?.lastLoginActivity ?? 'N/A'}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {alertsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                <li>Failed login attempts: <span className="font-semibold">{securityAlerts?.failedLoginAttempts ?? 0}</span></li>
                <li>Role changes made recently: <span className="font-semibold">{securityAlerts?.roleChangesRecent ?? 0}</span></li>
                <li>Locked or suspended accounts: <span className="font-semibold">{securityAlerts?.lockedAccounts ?? 0}</span></li>
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-8">
        <Link to="/admin/users">
          <Button>Add User</Button>
        </Link>
        <Link to="/admin/users">
          <Button variant="outline">Assign Role</Button>
        </Link>
      </div>
    </div>
  );
}
