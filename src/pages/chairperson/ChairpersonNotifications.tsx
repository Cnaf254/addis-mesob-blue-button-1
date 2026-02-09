import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const notifications = [
  { type: "New Membership Request", message: "New member application from Abebe Kebede." },
  { type: "New Loan Application", message: "Loan request submitted by Almaz Tesfaye." },
  { type: "Returned Application", message: "Membership application for Bekele Alemu returned for correction." },
  { type: "Escalation", message: "Loan application for Mulu Habte escalated due to delay." },
];

export default function ChairpersonNotifications() {
  return (
    <div className="p-6 md:p-10 min-h-screen w-full bg-white">
      <h2 className="text-2xl font-bold mb-2">Notifications</h2>
      <p className="mb-6 text-muted-foreground">Prevent workflow delays.</p>
      <Card>
        <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
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
