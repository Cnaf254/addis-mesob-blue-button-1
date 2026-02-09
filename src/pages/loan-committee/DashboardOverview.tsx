// DashboardOverview.tsx
// Loan Committee quick overview: pending loans, approvals, rejections, alerts



import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardOverview = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Loan Committee Dashboard</h2>
    {/* Top Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-blue-100">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Pending Loan Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold text-blue-900">--</span>
        </CardContent>
      </Card>
      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Approved (This Month)</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold text-blue-900">--</span>
        </CardContent>
      </Card>
      <Card className="bg-yellow-100">
        <CardHeader>
          <CardTitle className="text-lg text-yellow-900">Rejected (This Month)</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold text-yellow-900">--</span>
        </CardContent>
      </Card>
      <Card className="bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-lg text-yellow-900">High-Amount Loans Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold text-yellow-900">--</span>
        </CardContent>
      </Card>
    </div>

    {/* Alerts / Highlights */}
    <div className="mt-6 space-y-3">
      <h3 className="font-semibold mb-2">Alerts & Highlights</h3>
      <Alert className="bg-yellow-100">
        <AlertTitle className="text-yellow-900">Loans above threshold</AlertTitle>
        <AlertDescription>
          <Badge variant="outline" className="ml-2">None</Badge>
        </AlertDescription>
      </Alert>
      <Alert className="bg-blue-100">
        <AlertTitle className="text-blue-900">High guarantor exposure</AlertTitle>
        <AlertDescription>
          <Badge variant="outline" className="ml-2">None</Badge>
        </AlertDescription>
      </Alert>
      <Alert className="bg-blue-50">
        <AlertTitle className="text-blue-900">Overdue existing loans</AlertTitle>
        <AlertDescription>
          <Badge variant="outline" className="ml-2">None</Badge>
        </AlertDescription>
      </Alert>
    </div>

    {/* Quick Actions */}
    <div className="mt-8 flex gap-4">
      <Button>Review Next Loan</Button>
      <Button variant="link" asChild>
        <a href="/loan-committee/reviews">Go to Loan Reviews</a>
      </Button>
    </div>
  </div>
);

export default DashboardOverview;
