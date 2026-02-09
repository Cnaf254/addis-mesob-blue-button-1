
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const notifications = [
  { type: "Failed Bank Deduction", message: "Salary deduction failed for member M002." },
  { type: "Manual Payment Submitted", message: "New manual payment submitted by Almaz Tesfaye." },
  { type: "Reconciliation Required", message: "Mismatch detected for loan L003. Reconciliation needed." },
  { type: "Overdue Loan Alert", message: "Loan L002 is overdue. Immediate action required." },
];

export default function AccountantNotifications() {
  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-white">
      <h2 className="text-2xl font-bold mb-2">Notifications</h2>
      <p className="mb-6 text-muted-foreground">Stay informed of financial events.</p>

      <Card>
        <CardHeader>
          <CardTitle>Financial Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {notifications.map((n, i) => (
              <li key={i} className="border-l-4 border-blue-500 pl-4">
                <div className="font-semibold text-blue-800">{n.type}</div>
                <div className="text-muted-foreground">{n.message}</div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
