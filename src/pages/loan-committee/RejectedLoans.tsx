// RejectedLoans.tsx
// View rejected applications, reference rejection reasons


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

const dummyRejected = [
  {
    id: "LN-003",
    member: "Samuel Teshome",
    type: "Holiday",
    amount: 5000,
    rejectionDate: "2026-02-03",
    reason: "Insufficient savings balance",
  },
  // Add more dummy rejected loans as needed
];

const RejectedLoans = () => {
  const [selected, setSelected] = useState(null);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rejected Loans</CardTitle>
        <CardDescription>View rejected applications and reference rejection reasons for audit and transparency.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application ID</TableHead>
              <TableHead>Member Name</TableHead>
              <TableHead>Loan Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Rejection Date</TableHead>
              <TableHead>Rejection Reason</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyRejected.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No rejected loans.</TableCell>
              </TableRow>
            ) : (
              dummyRejected.map(loan => (
                <TableRow key={loan.id}>
                  <TableCell className="font-mono">{loan.id}</TableCell>
                  <TableCell>{loan.member}</TableCell>
                  <TableCell>{loan.type}</TableCell>
                  <TableCell>ETB {loan.amount.toLocaleString()}</TableCell>
                  <TableCell>{loan.rejectionDate}</TableCell>
                  <TableCell>{loan.reason}</TableCell>
                  <TableCell>
                    <Button variant="link" onClick={() => setSelected(loan)}>
                      View details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* Details Dialog */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rejected Loan Details</DialogTitle>
              <DialogDescription>Read-only details of the rejected loan application.</DialogDescription>
            </DialogHeader>
            {selected && (
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Application ID: </span>
                  <span className="font-mono">{selected.id}</span>
                </div>
                <div>
                  <span className="font-semibold">Member Name: </span>
                  <span>{selected.member}</span>
                </div>
                <div>
                  <span className="font-semibold">Loan Type: </span>
                  <span>{selected.type}</span>
                </div>
                <div>
                  <span className="font-semibold">Amount: </span>
                  <span>ETB {selected.amount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-semibold">Rejection Date: </span>
                  <span>{selected.rejectionDate}</span>
                </div>
                <div>
                  <span className="font-semibold">Rejection Reason: </span>
                  <span>{selected.reason}</span>
                </div>
              </div>
            )}
            <DialogClose asChild>
              <Button variant="outline" className="mt-4 w-full" onClick={() => setSelected(null)}>
                Close
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default RejectedLoans;
