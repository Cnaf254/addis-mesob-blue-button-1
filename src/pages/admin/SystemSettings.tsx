import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SystemSettings() {
  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-white">
      <h2 className="text-2xl font-bold mb-2">System Settings</h2>
      <p className="mb-6 text-muted-foreground">Configure system-wide behavior (not data).</p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>System name, language, date & currency format</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 max-w-xl">
            <label>System Name <input className="input" type="text" placeholder="System Name" /></label>
            <label>Default Language
              <select className="input">
                <option>Amharic</option>
                <option>English</option>
              </select>
            </label>
            <label>Date Format <input className="input" type="text" placeholder="YYYY-MM-DD" /></label>
            <label>Currency Format <input className="input" type="text" placeholder="ETB" /></label>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Loan Configuration</CardTitle>
          <CardDescription>Loan types, interest rates, limits, guarantor count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 max-w-xl">
            <label>Loan Types <input className="input" type="text" placeholder="Short, Long, Holiday" /></label>
            <label>Interest Rates <input className="input" type="number" placeholder="%" /></label>
            <label>Max Loan Limit <input className="input" type="number" placeholder="Amount" /></label>
            <label>Required Guarantor Count <input className="input" type="number" placeholder="Count" /></label>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Approval Workflow Settings</CardTitle>
          <CardDescription>Enable/disable steps, approval order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 max-w-xl">
            <label><input type="checkbox" /> Enable Approval Steps</label>
            <label>Approval Order
              <select className="input">
                <option>Fixed</option>
                <option>Admin-controlled</option>
              </select>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Settings</CardTitle>
          <CardDescription>Bank API, SMS/Email service</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 max-w-xl">
            <label>Bank API Key <input className="input" type="password" placeholder="********" /></label>
            <label>SMS Service <input className="input" type="text" placeholder="Provider" /></label>
            <label>Email Service <input className="input" type="text" placeholder="Provider" /></label>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">No historical data editing allowed.</p>
        </CardContent>
      </Card>
    </div>
  );
}
